import { readdir } from "node:fs/promises";
import path from "node:path";
import { FileField } from "@/components/admin/ui";

async function listDir(rel: string) {
  try {
    const files = await readdir(path.join(process.cwd(), "public", rel));
    return files.filter((f) => !f.startsWith(".")).sort();
  } catch {
    return [] as string[];
  }
}

export default async function MediaPage() {
  const [productImages, pdfs, uploads] = await Promise.all([listDir("images/product"), listDir("pdf"), listDir("uploads")]);
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">파일 업로드</h1>
      <div className="card mb-6 max-w-2xl">
        <p className="help mb-3">
          이미지나 PDF를 업로드하면 주소(URL)가 생성됩니다. 생성된 주소를 복사해 제품 섹션 HTML 등에 사용하세요.
          {process.env.BLOB_READ_WRITE_TOKEN ? " (저장소: Vercel Blob)" : " (저장소: 로컬 public/uploads — 배포 시 Vercel Blob 토큰을 설정하세요)"}
        </p>
        <FileField name="url" label="파일 선택 후 생성된 URL" folder="uploads" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 font-semibold">기존 제품 이미지 ({productImages.length})</h2>
          <p className="help mb-2">기존 사이트에서 옮겨온 이미지입니다. 경로: /images/product/파일명</p>
          <div className="max-h-96 overflow-y-auto text-xs">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {productImages.map((f) => (
                <div key={f} className="rounded border border-gray-100 p-1">
                  <img src={`/images/product/${f}`} alt="" style={{ width: "100%", height: 70, objectFit: "contain", background: "#fafafa" }} />
                  <div className="mt-1 truncate" title={`/images/product/${f}`}>
                    {f}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="card mb-6">
            <h2 className="mb-2 font-semibold">카탈로그 PDF ({pdfs.length})</h2>
            <p className="help mb-2">경로: /pdf/파일명</p>
            <ul className="max-h-60 overflow-y-auto text-xs">
              {pdfs.map((f) => (
                <li key={f}>
                  <a href={`/pdf/${f}`} target="_blank" className="underline">
                    /pdf/{f}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {uploads.length > 0 && (
            <div className="card">
              <h2 className="mb-2 font-semibold">로컬 업로드 폴더</h2>
              <ul className="text-xs">
                {uploads.map((f) => (
                  <li key={f}>/uploads/{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
