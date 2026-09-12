const fs = require('fs');

const filesToFix = [
  {
    path: 'frontend/src/app/admin/(panel)/courses/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreateCourse, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreateCourse, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm tài liệu'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateCourse(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateCourse(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật tài liệu'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeleteCourse, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeleteCourse, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá tài liệu'); } });`
      }
    ]
  },
  {
    path: 'frontend/src/app/admin/(panel)/products/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreateProduct, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreateProduct, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm sản phẩm'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProduct(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProduct(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật sản phẩm'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeleteProduct, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeleteProduct, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá sản phẩm'); } });`
      }
    ]
  },
  {
    path: 'frontend/src/app/admin/(panel)/projects/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreateProject, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreateProject, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm dự án'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProject(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProject(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật dự án'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeleteProject, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeleteProject, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá dự án'); } });`
      }
    ]
  },
  {
    path: 'frontend/src/app/admin/(panel)/partners/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreatePartner, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreatePartner, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm đối tác'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdatePartner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdatePartner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật đối tác'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeletePartner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeletePartner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá đối tác'); } });`
      }
    ]
  },
  {
    path: 'frontend/src/app/admin/(panel)/services/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreateService, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreateService, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm dịch vụ'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateService(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateService(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật dịch vụ'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeleteService, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeleteService, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá dịch vụ'); } });`
      }
    ]
  },
  {
    path: 'frontend/src/app/admin/(panel)/banners/page.jsx',
    replacements: [
      {
        old: `  const createMut = useMutation({ mutationFn: adminCreateBanner, onSuccess: () => { toast.success('Đã thêm banner!'); invalidate(); setModal(null); } });`,
        new: `  const createMut = useMutation({ mutationFn: adminCreateBanner, onSuccess: () => { toast.success('Đã thêm banner!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm banner'); } });`
      },
      {
        old: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateBanner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });`,
        new: `  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateBanner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật banner'); } });`
      },
      {
        old: `  const deleteMut = useMutation({ mutationFn: adminDeleteBanner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });`,
        new: `  const deleteMut = useMutation({ mutationFn: adminDeleteBanner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá banner'); } });`
      }
    ]
  }
];

filesToFix.forEach(item => {
  if (fs.existsSync(item.path)) {
    let c = fs.readFileSync(item.path, 'utf8');
    let normalized = c.replace(/\r\n/g, '\n');
    let modified = false;

    item.replacements.forEach(rep => {
      if (normalized.includes(rep.old)) {
        normalized = normalized.replace(rep.old, rep.new);
        modified = true;
      }
    });

    if (modified) {
      if (c.includes('\r\n')) {
        normalized = normalized.replace(/\n/g, '\r\n');
      }
      fs.writeFileSync(item.path, normalized, 'utf8');
      console.log(`Successfully added onError handlers to ${item.path}`);
    } else {
      console.log(`No changes made to ${item.path} (patterns not matched)`);
    }
  }
});
