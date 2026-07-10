# TAI LIEU BAN GIAO DU AN (HANDOVER) - Enterprise AI Portal

Chao mung ban den voi du an Enterprise AI Portal. Day la tai lieu giup ban nam bat nhanh cau truc va cach hoat dong cua du an.

## 1. Kien truc tong quan (Architecture)

Du an duoc xay dung dua tren **Next.js App Router** (Next.js phien ban moi nhat), ket hop voi **Tailwind CSS v4** cho phan giao dien va **Zustand** de quan ly state.

Cau truc thu muc chinh:
- `app/`: Noi chua tat ca cac trang (pages) va bo cuc (layouts). 
  - Thu muc `(auth)`: Chua cac trang lien quan den dang nhap/dang ky.
  - Thu muc `(dashboard)`: Chua phan chinh cua ung dung sau khi da dang nhap.
- `components/`: Noi chua cac thanh phan giao dien (UI components) duoc tai su dung.
  - `shared/`: Cac thanh phan dung chung o nhieu noi (Header, Sidebar...).
  - `chat/`, `dashboard/`: Cac thanh phan thuoc ve tung tinh nang cu the.
- `lib/`: Thu muc chua cac doan code ho tro, khong phai giao dien.
  - `store/`: Noi dinh nghia cac global state bang thu vien Zustand.
  - `types/`: Noi chua cac dinh nghia TypeScript (interface, type) de dam bao code chat che.
  - `utils/`: Cac ham ho tro nho va phan quyen.
- `hooks/`: Noi chua cac custom hooks cua React de tai su dung logic.

## 2. Quy uoc viet code (Coding Conventions)

- **UI & CSS**: Su dung Tailwind CSS. Khi can custom mau hoac kich thuoc rieng, tham khao the `@theme` trong `app/globals.css`.
- **State Management**: Voi cac state chi dung trong 1 component, hay dung `useState`. Voi state can chia se nhieu noi, hay dung `Zustand` trong muc `lib/store/`.
- **Typescript**: Luon khai bao kieu du lieu ro rang cho Props cua cac component va tra ve cua cac ham.

## 3. Cach doc code hieu qua

Ban hay bat dau doc tu:
1. `app/layout.tsx`: File boc ngoai cung nhat, chua the html, body va cac the khai bao font chu.
2. `app/(dashboard)/layout.tsx`: File layout boc rieng cho phan dashboard (chua Sidebar va Header).
3. `app/(dashboard)/settings/page.tsx`: Mot vi du ve page kha phuc tap gom nhieu form.
4. Tim doc cac comment bat dau bang `//` hoac `/*` trong cac file tren, toi da them rat nhieu chu thich de huong dan ban!

## 4. Cach chay du an (Getting Started)

Cai dat thu vien va chay server phat trien (development server):

```bash
npm install
npm run dev
```

Sau do mo [http://localhost:3000](http://localhost:3000) tren trinh duyet de xem ket qua.

Chuc ban lam viec hieu qua!
