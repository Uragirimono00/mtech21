import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionForm } from "@/components/admin/ActionForm";
import { updateAccount } from "@/app/admin/actions/content";

export default async function AccountPage() {
  const session = await requireAdmin();
  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">계정 설정</h1>
      <ActionForm action={updateAccount} submitLabel="변경 저장" className="max-w-lg">
        <div className="card">
          <div className="field">
            <label>이름</label>
            <input type="text" name="name" defaultValue={admin?.name ?? ""} />
          </div>
          <div className="field">
            <label>로그인 이메일</label>
            <input type="email" name="email" defaultValue={admin?.email ?? ""} required />
          </div>
          <hr className="my-4" style={{ display: "block", border: 0, borderTop: "1px solid #eee" }} />
          <div className="field">
            <label>새 비밀번호 (변경 시에만 입력, 8자 이상)</label>
            <input type="password" name="newPassword" autoComplete="new-password" />
          </div>
          <div className="field">
            <label>새 비밀번호 확인</label>
            <input type="password" name="confirmPassword" autoComplete="new-password" />
          </div>
          <div className="field">
            <label>현재 비밀번호 *</label>
            <input type="password" name="currentPassword" autoComplete="current-password" required />
            <div className="help">변경 사항을 저장하려면 현재 비밀번호를 입력해야 합니다.</div>
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
