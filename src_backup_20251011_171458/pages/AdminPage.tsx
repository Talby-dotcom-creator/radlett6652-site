// src/pages/AdminPage.tsx
import React, { useState, useEffect } from "react";
import { optimizedApi as api } from "../lib/optimizedApi";
import {
  LodgeDocument,
  MeetingMinutes,
  MemberProfile,
  Testimonial,
} from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { usePagination } from "../hooks/usePagination";
import PaginationControls from "../components/PaginationControls";
import TestimonialForm from "../components/admin/TestimonialForm";
import Button from "../components/Button";

const AdminPage: React.FC = () => {
  const toast = useToast();

  // ✅ Pagination hooks
  const [documentsState, documentsActions] = usePagination({
    initialPageSize: 10,
  });
  const [minutesState, minutesActions] = usePagination({ initialPageSize: 10 });
  const [membersState, membersActions] = usePagination({ initialPageSize: 10 });

  // ✅ State for each data type
  const [documents, setDocuments] = useState<LodgeDocument[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ UI state for testimonials
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  /* -------------------- DOCUMENTS -------------------- */
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const docs = await api.getLodgeDocuments();
        setDocuments(docs);
        documentsActions.setTotalItems(docs.length);
      } catch (err) {
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

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
  // Remove getAllMembers usage; implement if needed

  /* -------------------- TESTIMONIALS -------------------- */
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const all = await api.getTestimonials();
        setTestimonials(all);
      } catch (err) {
        toast.error("Failed to load testimonials");
      }
    };
    loadTestimonials();
  }, []);

  const handleSaveTestimonial = async (
    data: Omit<Testimonial, "id" | "created_at" | "updated_at">
  ) => {
    try {
      // TODO: replace with api call to insert/update testimonial
      console.log("Saving testimonial:", data);
      toast.success("Testimonial saved!");
      setShowForm(false);
      setEditingTestimonial(null);
      // Refresh list
      const all = await api.getTestimonials();
      setTestimonials(all);
    } catch (err) {
      toast.error("Failed to save testimonial");
    }
  };

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
              pageSize={documentsState.pageSize}
              totalItems={documentsState.totalItems}
              totalPages={documentsState.totalPages}
              canGoNext={documentsState.canGoNext}
              canGoPrev={documentsState.canGoPrev}
              onPageChange={documentsActions.setPage}
              onPageSizeChange={documentsActions.setPageSize}
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
              pageSize={minutesState.pageSize}
              totalItems={minutesState.totalItems}
              totalPages={minutesState.totalPages}
              canGoNext={minutesState.canGoNext}
              canGoPrev={minutesState.canGoPrev}
              onPageChange={minutesActions.setPage}
              onPageSizeChange={minutesActions.setPageSize}
              onFirstPage={minutesActions.goToFirstPage}
              onLastPage={minutesActions.goToLastPage}
              onNextPage={minutesActions.nextPage}
              onPrevPage={minutesActions.prevPage}
            />
          </div>

          {/* -------------------- Members -------------------- */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Members</h2>
            <ul className="mb-4">
              {members.map((member) => (
                <li key={member.id} className="border-b py-2">
                  {member.full_name}
                </li>
              ))}
            </ul>
            <PaginationControls
              currentPage={membersState.currentPage}
              pageSize={membersState.pageSize}
              totalItems={membersState.totalItems}
              totalPages={membersState.totalPages}
              canGoNext={membersState.canGoNext}
              canGoPrev={membersState.canGoPrev}
              onPageChange={membersActions.setPage}
              onPageSizeChange={membersActions.setPageSize}
              onFirstPage={membersActions.goToFirstPage}
              onLastPage={membersActions.goToLastPage}
              onNextPage={membersActions.nextPage}
              onPrevPage={membersActions.prevPage}
            />
          </div>

          {/* -------------------- Testimonials -------------------- */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Testimonials</h2>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                + Add Testimonial
              </Button>
            )}

            {showForm && (
              <TestimonialForm
                onSubmit={handleSaveTestimonial}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTestimonial(null);
                }}
                initialData={editingTestimonial || undefined}
              />
            )}

            <ul className="mt-6 space-y-3">
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <li
                    key={t.id}
                    className="border p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{t.member_name}</p>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {t.content}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTestimonial(t);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                  </li>
                ))
              ) : (
                <p className="text-neutral-500">No testimonials yet.</p>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
