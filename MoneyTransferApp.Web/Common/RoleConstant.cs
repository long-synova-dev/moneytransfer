using System.Collections.Generic;

namespace MoneyTransferApp.Web.Common
{
    public static class RoleConstant
    {
        public const string R0 = "R0";
        public const string R1 = "R1";
        public const string R2 = "R2";
        public const string R3 = "R3";
        public const string R4 = "R4";
        public const string R5 = "R5";
        public const string R6 = "R6";

        public static readonly List<string> CaiRoleList = new List<string>
        {
            R2,
            R3,
            R4,
            R5,
            R6
        };

        public static readonly List<string> SaiRoleList = new List<string>
        {
            R0,
            R1
        };

        public static readonly List<string> AllRoleList = new List<string>
        {
            R2,
            R3,
            R4,
            R5,
            R6,
            R0,
            R1
        };

        public const string AllRoles = "R0, R1, R2, R3, R4, R5, R6";

        public const string SaiRolesOnly = "R0, R1";

        public const string CaiRolesOnly = "R2, R3, R4, R5, R6";

        public const string GodOnly = "R0";

        public const string AdminOnly = "R1";

        public const string AccountOwnerOnly = "R2";

        public const string AccountOwnerAndSuperModOnly = "R2, R3";
    }
}
