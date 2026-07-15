const canCreateCategory = (role) => {
    return ["Super Admin", "Admin"].includes(role);
};

const canEditCategory = (role) => {
    return ["Super Admin", "Admin"].includes(role);
};

const canDeleteCategory = (role) => {
    return role === "Super Admin";
};

const canToggleStatus = (role) => {
    return ["Super Admin", "Admin"].includes(role);
};

module.exports = {
    canCreateCategory,
    canEditCategory,
    canDeleteCategory,
    canToggleStatus
};