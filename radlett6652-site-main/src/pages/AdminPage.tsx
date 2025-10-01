// src/pages/AdminPage.tsx
import React, { useState, useEffect } from "react";
import { optimizedApi as api } from "../lib/optimizedApi";
import { LodgeDocument, MeetingMinutes, MemberProfile } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { usePagination } from "../hooks/usePagination";
import PaginationControls from "../components/PaginationControls";

const AdminPage: React.FC = () => {
  const toast = useToast();

  // ✅ Pagination hooks for each section
  const [documentsState, documentsActions] = usePagination({ initialPageSize: 10 });
  const [minutesState, minutesActions] = usePagination({ initialPageSize: 10 });
  const [membersState, membersActions] = usePagination({ initialPageSize: 10 });

  // ✅ State for each data type
  const [documents, setDocuments] = useState<LodgeDocument[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- DOCUMENTS -------------------- */
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const { documents, total } = await api.getLodgeDocumentsPaginated(
          documentsState.currentPage,
          documentsState.pageSize
        );
        setDocuments(documents);
        documentsActions.setTotalItems(total);
      } catch (err) {
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, [documentsState.currentPage, documentsState.pageSize]);

  /* -------------------- MINUTES -------------------- */
  useEffect(() => {
    const loadMinutes = async () => {
      setLoading(true);
      try {
        const allMinutes = await api.getMeetingMinutes();
        setMinutes(allMinutes);
        minutesActions.setTotalItems(allMinutes.length);
      } catch (err) {
        toast.error("Failed to load minutes");
      } finally {
        setLoading(false);
      }
    };
    loadMinutes();
  }, []);

  /* -------------------- MEMBERS -------------------- */
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const allMembers = await api.getAllMembers();
        setMembers(allMembers);
        membersActions.setTotalItems(allMembers.length);
      } catch (err) {
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* -------------------- Documents -------------------- */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Documents</h2>
            <ul className="mb-4">
              {documents.map((doc) => (
                <li key={doc.id} className="border-b py-2">
                  {doc.title} ({doc.category})
                </li>
              ))}
            </ul>
            <PaginationControls
              currentPage={documentsState.currentPage}
              totalPages={documentsState.totalPages}
              pageSize={documentsState.pageSize}
              totalItems={documentsState.totalItems}
              onPageChange={documentsActions.setPage}
              onPageSizeChange={documentsActions.setPageSize}
              canGoNext={documentsActions.canGoNext}
              canGoPrev={documentsActions.canGoPrev}
              onFirstPage={documentsActions.goToFirstPage}
              onLastPage={documentsActions.goToLastPage}
              onNextPage={documentsActions.nextPage}
              onPrevPage={documentsActions.prevPage}
            />
          </div>

          {/* -------------------- Meeting Minutes -------------------- */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Meeting Minutes</h2>
            <ul className="mb-4">
              {minutes.map((m) => (
                <li key={m.id} className="border-b py-2">
                  {m.title} — {new Date(m.meeting_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <PaginationControls
              currentPage={minutesState.currentPage}
              totalPages={minutesState.totalPages}
              pageSize={minutesState.pageSize}
              totalItems={minutesState.totalItems}
              onPageChange={minutesActions.setPage}
              onPageSizeChange={minutesActions.setPageSize}
              canGoNext={minutesActions.canGoNext}
              canGoPrev={minutesActions.canGoPrev}
              onFirstPage={minutesActions.goToFirstPage}
              onLastPage={minutesActions.goToLastPage}
              onNextPage={minutesActions.nextPage}
              onPrevPage={minutesActions.prevPage}
            />
          </div>

          {/* -------------------- Members -------------------- */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Members</h2>
            <ul className="mb-4">
              {members.map((member) => (
                <li key={member.id} className="border-b py-2">
                  {member.full_name} ({member.role})
                </li>
              ))}
            </ul>
            <PaginationControls
              currentPage={membersState.currentPage}
              totalPages={membersState.totalPages}
              pageSize={membersState.pageSize}
              totalItems={membersState.totalItems}
              onPageChange={membersActions.setPage}
              onPageSizeChange={membersActions.setPageSize}
              canGoNext={membersActions.canGoNext}
              canGoPrev={membersActions.canGoPrev}
              onFirstPage={membersActions.goToFirstPage}
              onLastPage={membersActions.goToLastPage}
              onNextPage={membersActions.nextPage}
              onPrevPage={membersActions.prevPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
