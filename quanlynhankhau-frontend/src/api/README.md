Danh sách API cho Frontend - Hệ Thống Quản Lý Nhân Khẩu
# Frontend API Documentation
admin API
GET /admin/vaitro
PUT /admin/taikhoan/${id}?tenVaiTro=${encodeURIComponent(tenVaiTro)},data
POST /admin/taikhoan/${encodeURIComponent(tenVaiTro)}
GET /admin/taikhoan
DELETE /admin/taikhoan/${id}
PUT /admin/taikhoan/${id}/lock
PUT /admin/taikhoan/${id}/reset-password

login API
POST /auth/login

nhankhau API
GET /nhankhau
DELETE /api/nhankhau/{id}
GET /nhankhau/${id}
PUT /nhankhau/${id}`, payload
POST /nhankhau', payload
GET /nhankhau/search
GET /nhankhau/available

thanhvienho API
POST /thanhvienho, payload
DELETE /thanhvienho/${record.id}
GET /thanhvienho/hokhau/${id}

hokhau API
GET /hokhau
DELETE /hokhau/${id}
GET /hokhau/${hoKhauId}
GET /hokhau/${hoKhauId}/thanhvien
*GET /nhankhau
*GET /nhankhau/available
PUT /hokhau/${hoKhauId}, payload
*GET /nhankhau/search
*POST /thanhvienho, payload
POST /hokhau/${hoKhauId}/tach, payload
*DELETE /thanhvienho/${record.id}
*GET /nhankhau/available
*GET /nhankhau
GET /hokhau/${id}
*GET /thanhvienho/hokhau/${id}
PUT /hokhau/${id}, payload
POST /hokhau, payload

ghinhanthaydoi API
GET /ghinhanthaydoi
DELETE /ghinhanthaydoi/${id}

tamtrutamvang API
*GET /nhanKhau
GET /tamtrutamvang/${id}
PUT /tamtrutamvang/${id}, payload
POST /tamtrutamvang, payload
GET /tamtrutamvang/loai/tamtru?tuNgay=${tuNgay}&denNgay=${denNgay}
GET /tamtrutamvang/loai/tamvang?tuNgay=${tuNgay}&denNgay=${denNgay}
GET /tamtrutamvang/search?keyword=${value}
DELETE /tamtrutamvang/${id}

thongke API
GET /thongke/nhankhau?tuNgay=${tuNgay}&denNgay=${denNgay}
GET /thongke/nhankhau/nhomtuoi/${nhomTuoi}

sukien API
*GET /nhankhau
GET /sukien/${id}
PUT /sukien/${id}, payload
POST /sukien, payload
GET /sukien/loai/sinh
GET /sukien/loai/mat
GET /sukien/stats
GET /sukien/search?keyword=${value}
GET /sukien/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}
DELETE /sukien/${id}

baocao API
GET /baocao/thuchitonghop
GET /baocao/gioitinh

thuchi API

chiAPI
GET /chi
get /chi/${id}
GET /chi/loai/${loaiChi}
POST /chi, data
PUT /chi/${id}, data
DELETE /chi/${id}
GET /chi/search?keyword=${value}
GET /chi/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}
GET /chi/thongke
GET /chi/thongke/loai/${loaiChi}
GET /chi/thongke/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}

hoatDongThienNguyenAPI
GET /hoatdong
GET /hoatdong/${id}
GET /hoatdong/active
GET /hoatdong/trangthai/${trangThai}
GET /hoatdong/${id}/thongke
POST /hoatdong, data
PUT /hoatdong/${id}, data
DELETE /hoatdong/${id}
GET /hoatdong/search?keyword=${value}
GET /hoatdong/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}

khoanPhi API
GET /khoanphi
GET /khoanphi/${id}
GET /khoanphi/active
GET /khoanphi/loai/${loai}
POST /khoanphi, data
PUT /khoanphi/${id}, data
DELETE /khoanphi/${id}
GET /khoanphi/search?keyword=${value}
PUT /khoanphi/${id}/trangthai, trangThai

thuPhi API
GET /thuphi
GET /thuphi/${id}
GET /thuphi/hoKhau/${hoKhauId}
GET /thuphi/khoanphi/${khoanPhiId}
GET /thuphi/khoanphi/${khoanPhiId}/chuadong
GET /thuphi/khoanphi/${khoanPhiId}/dadong
GET /thuphi/khoanphi/${khoanPhiId}/thongke
POST /thuphi/taomoi/khoanphi/${khoanPhiId}
POST /thuphi, data
PUT /thuphi/${id}, data
PUT /thuphi/${id}/trangthai, trangThai
DELETE /thuphi/${id}
GET /thuphi/search?keyword=${value}

thuThienNguyenAPI
GET /thuthiennguyen
GET /thuthiennguyen/${id}
GET /thuthiennguyen/hoatdong/${hoatDongId}
POST /thuthiennguyen, data
PUT /thuthiennguyen/${id}, data
DELETE /thuthiennguyen/${id}
GET /thuthiennguyen/search?keyword=${value}
GET /thuthiennguyen/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}


