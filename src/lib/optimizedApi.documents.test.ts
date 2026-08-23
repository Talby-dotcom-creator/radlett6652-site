import { optimizedApi } from "./optimizedApi";
import { supabase } from "./supabase";

jest.mock("./supabase", () => ({
  supabase: {
    from: jest.fn(),
    storage: { from: jest.fn() },
  },
}));

describe("optimizedApi member documents", () => {
  it("reuses the documents query and signs private GPC storage paths", async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        {
          id: "gpc-2025-07",
          title: "GPC Minutes",
          category: "gpc_minutes",
          meeting_date: "2025-07-12",
          meeting_number: null,
          storage_path: "GPC minutes/GPC Minutes - 2025-07-12.pdf",
        },
      ],
      error: null,
    });
    const select = jest.fn().mockReturnValue({ order });
    (supabase.from as jest.Mock).mockReturnValue({ select });

    const createSignedUrl = jest.fn().mockResolvedValue({
      data: { signedUrl: "https://private.test/signed-gpc.pdf" },
      error: null,
    });
    (supabase.storage.from as jest.Mock).mockReturnValue({ createSignedUrl });

    const documents = await optimizedApi.getLodgeDocuments();

    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("lodge_documents");
    expect(supabase.storage.from).toHaveBeenCalledWith("member-documents");
    expect(createSignedUrl).toHaveBeenCalledWith(
      "GPC minutes/GPC Minutes - 2025-07-12.pdf",
      60 * 60
    );
    expect(documents[0].file_url).toBe(
      "https://private.test/signed-gpc.pdf"
    );
  });
});
