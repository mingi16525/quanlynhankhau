# Hướng dẫn sử dụng Permission System

## 📋 Tổng quan

Hệ thống phân quyền dựa trên **Role-Based Access Control (RBAC)** với permissions chi tiết theo format: `RESOURCE:ACTION`

## 🔐 Backend Permission

### 1. Cấu trúc Permission

**Format**: `RESOURCE:ACTION`

**Resources**: 
- `NHAN_KHAU` - Nhân khẩu
- `HO_KHAU` - Hộ khẩu  
- `TAM_TRU_VANG` - Tạm trú tạm vắng
- `SU_KIEN` - Sự kiện
- `KHOAN_CHI_BAT_BUOC` - Khoản chi phí bắt buộc
- `DANH_SACH_THU` - Danh sách thu
- `DANH_SACH_CHI` - Danh sách chi
- `HOAT_DONG_THIEN_NGUYEN` - Hoạt động thiện nguyện
- `THU_THIEN_NGUYEN` - Thu thiện nguyện

**Actions**:
- `READ` - Xem
- `CREATE` - Tạo mới
- `UPDATE` - Cập nhật
- `DELETE` - Xóa

**Admin permission**: `*:*` (full access)

### 2. Sử dụng @PreAuthorize trong Service

```java
import org.springframework.security.access.prepost.PreAuthorize;

@Service
public class NhanKhauService {
    
    // Chỉ cho phép người có quyền READ NHAN_KHAU hoặc ADMIN
    @PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('*:*')")
    public List<NhanKhau> getAllNhanKhau() {
        return nhanKhauRepository.findAll();
    }
    
    // Chỉ cho phép người có quyền CREATE NHAN_KHAU hoặc ADMIN
    @PreAuthorize("hasAuthority('NHAN_KHAU:CREATE') or hasAuthority('*:*')")
    public NhanKhau createNhanKhau(NhanKhau nhanKhau) {
        return nhanKhauRepository.save(nhanKhau);
    }
    
    // Chỉ cho phép người có quyền UPDATE NHAN_KHAU hoặc ADMIN
    @PreAuthorize("hasAuthority('NHAN_KHAU:UPDATE') or hasAuthority('*:*')")
    public NhanKhau updateNhanKhau(Long id, NhanKhau nhanKhau) {
        // ...
    }
    
    // Chỉ cho phép người có quyền DELETE NHAN_KHAU hoặc ADMIN
    @PreAuthorize("hasAuthority('NHAN_KHAU:DELETE') or hasAuthority('*:*')")
    public void deleteNhanKhau(Long id) {
        nhanKhauRepository.deleteById(id);
    }
}
```

### 3. Kiểm tra nhiều quyền

```java
// Cần CẢ HAI quyền
@PreAuthorize("hasAuthority('NHAN_KHAU:READ') and hasAuthority('HO_KHAU:READ')")

// Chỉ cần MỘT trong hai quyền
@PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('NHAN_KHAU:CREATE')")

// Kiểm tra vai trò
@PreAuthorize("hasRole('ADMIN_HE_THONG')")

// Kết hợp vai trò và quyền
@PreAuthorize("hasRole('ADMIN_HE_THONG') or hasAuthority('NHAN_KHAU:DELETE')")
```

### 4. Permissions theo Role

#### ADMIN_HE_THONG
```
*:* (Full access)
```

#### CAN_BO_NHAN_KHAU (16 permissions)
```
NHAN_KHAU:READ, CREATE, UPDATE, DELETE
HO_KHAU:READ, CREATE, UPDATE, DELETE
TAM_TRU_VANG:READ, CREATE, UPDATE, DELETE
SU_KIEN:READ, CREATE, UPDATE, DELETE
```

#### KE_TOAN_THU_CHI (20 permissions)
```
KHOAN_CHI_BAT_BUOC:READ, CREATE, UPDATE, DELETE
DANH_SACH_THU:READ, CREATE, UPDATE, DELETE
DANH_SACH_CHI:READ, CREATE, UPDATE, DELETE
HOAT_DONG_THIEN_NGUYEN:READ, CREATE, UPDATE, DELETE
THU_THIEN_NGUYEN:READ, CREATE, UPDATE, DELETE
```

#### TO_TRUONG (36 permissions)
```
Tất cả permissions của CAN_BO_NHAN_KHAU + KE_TOAN_THU_CHI
```

## 🎨 Frontend Permission

### 1. Sử dụng AuthContext

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { authState, hasPermission, hasRole } = useAuth();
    
    // Kiểm tra quyền
    const canCreate = hasPermission('NHAN_KHAU:CREATE');
    const canDelete = hasPermission('NHAN_KHAU:DELETE');
    const isAdmin = hasPermission('*:*');
    
    // Kiểm tra vai trò
    const isCaNhanKhau = hasRole('CAN_BO_NHAN_KHAU');
    const isKeToan = hasRole('KE_TOAN_THU_CHI');
    
    return (
        <div>
            {canCreate && <Button>Thêm mới</Button>}
            {canDelete && <Button danger>Xóa</Button>}
            {isAdmin && <Button>Quản lý hệ thống</Button>}
        </div>
    );
}
```

### 2. Sử dụng PermissionWrapper Component

```jsx
import PermissionWrapper from '../components/PermissionWrapper';

function NhanKhauPage() {
    return (
        <div>
            {/* Chỉ hiển thị nút nếu có quyền CREATE */}
            <PermissionWrapper permission="NHAN_KHAU:CREATE">
                <Button type="primary" onClick={handleCreate}>
                    Thêm nhân khẩu
                </Button>
            </PermissionWrapper>
            
            {/* Hiển thị thông báo nếu không có quyền */}
            <PermissionWrapper 
                permission="NHAN_KHAU:DELETE"
                fallback={<Alert message="Bạn không có quyền xóa" type="warning" />}
            >
                <Button danger onClick={handleDelete}>Xóa</Button>
            </PermissionWrapper>
        </div>
    );
}
```

### 3. Sử dụng RoleWrapper Component

```jsx
import RoleWrapper from '../components/RoleWrapper';

function DashboardPage() {
    return (
        <div>
            {/* Chỉ hiển thị cho Admin */}
            <RoleWrapper roles="ADMIN_HE_THONG">
                <AdminPanel />
            </RoleWrapper>
            
            {/* Hiển thị cho nhiều roles */}
            <RoleWrapper roles={['CAN_BO_NHAN_KHAU', 'TO_TRUONG']}>
                <NhanKhauManagement />
            </RoleWrapper>
        </div>
    );
}
```

### 4. Ẩn/hiện cột trong Table

```jsx
const columns = [
    {
        title: 'Họ tên',
        dataIndex: 'hoTen',
    },
    // Chỉ hiển thị cột Actions nếu có quyền UPDATE hoặc DELETE
    ...(hasPermission('NHAN_KHAU:UPDATE') || hasPermission('NHAN_KHAU:DELETE') 
        ? [{
            title: 'Thao tác',
            render: (record) => (
                <>
                    {hasPermission('NHAN_KHAU:UPDATE') && 
                        <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    }
                    {hasPermission('NHAN_KHAU:DELETE') && 
                        <Button danger onClick={() => handleDelete(record)}>Xóa</Button>
                    }
                </>
            )
        }] 
        : []
    )
];
```

### 5. Điều hướng có điều kiện

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ permission, children }) {
    const { hasPermission } = useAuth();
    
    if (!hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
}

// Sử dụng trong Router
<Route path="/nhankhau/create" element={
    <ProtectedRoute permission="NHAN_KHAU:CREATE">
        <NhanKhauCreatePage />
    </ProtectedRoute>
} />
```

## 🧪 Testing Permissions

### Backend Testing

```java
@Test
@WithMockUser(authorities = {"NHAN_KHAU:READ"})
public void testGetAllNhanKhau_withPermission() {
    // Should work
    List<NhanKhau> result = nhanKhauService.getAllNhanKhau();
    assertNotNull(result);
}

@Test
@WithMockUser(authorities = {"HO_KHAU:READ"}) // Wrong permission
public void testGetAllNhanKhau_withoutPermission() {
    // Should throw AccessDeniedException
    assertThrows(AccessDeniedException.class, () -> {
        nhanKhauService.getAllNhanKhau();
    });
}
```

### Frontend Testing

```javascript
// Test với role khác nhau
describe('NhanKhauPage Permissions', () => {
    it('should show create button for CAN_BO_NHAN_KHAU', () => {
        const mockAuthState = {
            role: 'CAN_BO_NHAN_KHAU',
            authorities: ['NHAN_KHAU:CREATE', 'NHAN_KHAU:READ']
        };
        
        render(<NhanKhauPage />, { authState: mockAuthState });
        expect(screen.getByText('Thêm nhân khẩu')).toBeInTheDocument();
    });
    
    it('should NOT show delete button for CAN_BO_NHAN_KHAU without DELETE permission', () => {
        const mockAuthState = {
            role: 'CAN_BO_NHAN_KHAU',
            authorities: ['NHAN_KHAU:READ']
        };
        
        render(<NhanKhauPage />, { authState: mockAuthState });
        expect(screen.queryByText('Xóa')).not.toBeInTheDocument();
    });
});
```

## ⚠️ Best Practices

### Backend
1. ✅ **Luôn kiểm tra quyền ở Service layer**, không chỉ ở Controller
2. ✅ **Sử dụng `@PreAuthorize`** thay vì logic kiểm tra thủ công
3. ✅ **Luôn bao gồm admin permission** (`*:*`) trong điều kiện OR
4. ✅ **Enable Method Security** trong SecurityConfig
5. ⚠️ **Không hardcode permissions** - dùng constants

### Frontend
1. ✅ **Kiểm tra quyền trước khi hiển thị UI** (buttons, menus, etc.)
2. ✅ **Kiểm tra quyền trước khi gọi API** (validation sớm)
3. ✅ **Sử dụng wrapper components** cho code sạch hơn
4. ✅ **Cache permission checks** nếu gọi nhiều lần
5. ⚠️ **Không tin tưởng frontend hoàn toàn** - Backend vẫn là tầng bảo mật chính

## 🔧 Troubleshooting

### Backend không kiểm tra permission
**Nguyên nhân**: Chưa enable `@EnableMethodSecurity`
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // ✅ Phải có dòng này
public class SecurityConfig {
    // ...
}
```

### Frontend không nhận được authorities
**Nguyên nhân**: Token không chứa authorities
**Giải pháp**: Check response từ `/api/auth/login` phải có:
```json
{
    "token": "...",
    "user": {
        "username": "canbonk",
        "role": "CAN_BO_NHAN_KHAU",
        "authorities": ["NHAN_KHAU:READ", "NHAN_KHAU:CREATE", ...]
    }
}
```

### 403 Forbidden khi đã đăng nhập
**Nguyên nhân**: User không có permission cần thiết
**Giải pháp**: 
1. Check authorities trong AuthContext
2. Check @PreAuthorize trong service method
3. Check permissions trong database

## 📚 Tài liệu tham khảo

- [Spring Security Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring @PreAuthorize](https://www.baeldung.com/spring-security-method-security)
- [React Context API](https://react.dev/reference/react/useContext)
