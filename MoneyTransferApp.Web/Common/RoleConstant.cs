using System.Collections.Generic;

namespace MoneyTransferApp.Web.Common
{
    public static class RoleConstant
    {
        public const string R0 = "R0";
        public const string R1 = "R1";
        public const string R2 = "R2";

        public static readonly List<string> AllRoleList = new List<string>
        {
            R0,
            R1,
            R2
        };

        public const string AllRoles = "R0, R1, R2";
        
        public const string GodOnly = "R0";

        public const string AdminOnly = "R1";

        public const string BranchUserOnly = "R2";
    }
}
