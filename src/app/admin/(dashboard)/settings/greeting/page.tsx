import { getSetting } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { FileField } from "@/components/admin/ui";
import { saveGreetingSettings } from "@/app/admin/actions/content";

export default async function GreetingSettingsPage() {
  const g = await getSetting("greeting");
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">인사말</h1>
      <ActionForm action={saveGreetingSettings}>
        <div className="card">
          <div className="field">
            <label>제목</label>
            <input type="text" name="title" defaultValue={g.title} />
          </div>
          <div className="field">
            <label>부제 (포인트 컬러)</label>
            <input type="text" name="subtitle" defaultValue={g.subtitle} />
          </div>
          <div className="field">
            <label>본문</label>
            <textarea name="body" defaultValue={g.body} style={{ minHeight: 200 }} />
            <div className="help">줄바꿈이 그대로 표시됩니다.</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FileField name="signImage" label="서명 이미지 (오른쪽 정렬, 높이 30px)" defaultValue={g.signImage} folder="company" accept="image/*" />
            <FileField name="image" label="하단 이미지 (730×316)" defaultValue={g.image} folder="company" accept="image/*" />
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
