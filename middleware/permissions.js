module.exports = {

    canCreateUser(currentUserRole, newUserRole) {

        switch (currentUserRole) {

            case "Super Admin":
                return ["Admin", "Manager", "Employee"].includes(newUserRole);

            case "Admin":
                return ["Manager", "Employee"].includes(newUserRole);

            case "Manager":
                return newUserRole === "Employee";

            default:
                return false;

        }

    },



    canEditUser(currentUserRole, targetUserRole) {

        switch (currentUserRole) {

            case "Super Admin":
                return true;

            case "Admin":
                return ["Manager", "Employee"].includes(targetUserRole);

            case "Manager":
                return targetUserRole === "Employee";

            default:
                return false;

        }

    },



    canDeleteUser(currentUserRole, targetUserRole) {

        switch (currentUserRole) {

            case "Super Admin":
                return true;

            case "Admin":
                return ["Manager", "Employee"].includes(targetUserRole);

            default:
                return false;

        }

    }

};