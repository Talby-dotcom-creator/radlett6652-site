-- Prevent authenticated users from self-assigning role/status through direct API calls.
-- Admin/service-role updates remain available for the server-side admin workflow.

CREATE OR REPLACE FUNCTION public.prevent_member_role_status_self_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_is_admin boolean;
BEGIN
  IF auth.role() IS DISTINCT FROM 'authenticated' THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.member_profiles mp
    WHERE mp.user_id = auth.uid()
      AND mp.role = 'admin'
      AND mp.status = 'active'
  )
  INTO caller_is_admin;

  IF caller_is_admin THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Users can only create their own profile';
    END IF;

    IF COALESCE(NEW.role, 'member') <> 'member' THEN
      RAISE EXCEPTION 'Users cannot assign their own role';
    END IF;

    IF COALESCE(NEW.status, 'pending') <> 'pending' THEN
      RAISE EXCEPTION 'Users cannot assign their own status';
    END IF;

    NEW.role := 'member';
    NEW.status := 'pending';
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Users cannot change profile ownership';
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Users cannot update their own role';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Users cannot update their own status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_member_role_status_self_change ON public.member_profiles;

CREATE TRIGGER prevent_member_role_status_self_change
BEFORE INSERT OR UPDATE ON public.member_profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_member_role_status_self_change();

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.member_profiles;
CREATE POLICY "Users can insert their own pending member profile"
  ON public.member_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'member'
    AND status = 'pending'
  );
