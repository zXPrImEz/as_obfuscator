return {
    ["Minify"] = {
        LuaVersion = "Lua51";
        VarNamePrefix = "";
        NameGenerator = "MangledShuffled";
        PrettyPrint = false;
        Seed = 0;
        Steps = {}
    };
    ["Free"] = {
        LuaVersion = "Lua51";
        VarNamePrefix = "";
        NameGenerator = "Confuse";
        PrettyPrint = false;
        Seed = 0;
        Steps = {
            { Name = "EncryptStrings"; Settings = {} };
            { Name = "AntiTamper"; Settings = { UseDebug = false; } };
            { Name = "AddVararg"; Settings = {} };
            { Name = "ConstantArray"; Settings = { Treshold = 0; StringsOnly = true; Shuffle = true; Rotate = true; LocalWrapperTreshold = 0; } };
            { Name = "ProxifyLocals"; Settings = {} };
            { Name = "NumbersToExpressions"; Settings = {} };
            { Name = "AddVararg"; Settings = {} };
            { Name = "WrapInFunction"; Settings = {} };
        }
    };
    ["Premium"] = {
        LuaVersion = "Lua51";
        VarNamePrefix = "";
        NameGenerator = "Number";
        PrettyPrint = false;
        Seed = 0;
        Steps = {
            { Name = "AntiTamper"; Settings = { UseDebug = false; } };
            { Name = "NumbersToExpressions"; Settings = {} };
            { Name = "AddVararg"; Settings = {} };
            { Name = "ConstantArray"; Settings = { Treshold = 1; StringsOnly = true; Shuffle = true; Rotate = false; LocalWrapperTreshold = 0 } };
            { Name = "WrapInFunction"; Settings = {} };
        }
    };
    ["Administration"] = {
        LuaVersion = "Lua51";
        VarNamePrefix = "";
        NameGenerator = "Mangled";
        PrettyPrint = false;
        Seed = 0;
        Steps = {
            { Name = "AntiTamper"; Settings = { UseDebug = false; } };
            { Name = "NumbersToExpressions"; Settings = {} };
            { Name = "EncryptStrings"; Settings = {} };
            { Name = "ConstantArray"; Settings = { Treshold = 1; StringsOnly = true; Shuffle = true; Rotate = false; LocalWrapperTreshold = 0 } };
            { Name = "Vmify"; Settings = {} };
            { Name = "EncryptStrings"; Settings = {} };
        }
    };
}

--# Pew Settings / Best Settings #--
-- return {
-- ["Weak"] = {
--     LuaVersion = "Lua51";
--     VarNamePrefix = "";
--     NameGenerator = "Il";
--     PrettyPrint = false;
--     Seed = 0;
--     Steps = {
--         {Name = "EncryptStrings"; Settings = {}};
--         {Name = "AntiTamper";Settings = {UseDebug = false;}};
--         {Name = "AddVararg"; Settings = {}};
--         {Name = "Vmify"; Settings = {}};
--         {Name = "ConstantArray"; Settings = { Treshold = 0; StringsOnly = true; Shuffle = true; Rotate = true; LocalWrapperTreshold = 0;}};
--         {Name = "Vmify"; Settings = {}};
--         {Name = "ProxifyLocals"; Settings = {}}
--         {Name = "NumbersToExpressions"; Settings = {}};
--         {Name = "SplitStrings"; Settings = { CustomFunctionType = 'local'; ConcatenationType = 'custom'; CustomLocalFunctionsCount = 1;}};
--         {Name = "AddVararg"; Settings = {}};
--         {Name = "WrapInFunction";Settings = {}};
--     }
-- };
-- ["Medium"] = {
--     LuaVersion = "Lua51";
--     VarNamePrefix = "";
--     NameGenerator = "Mangled";
--     PrettyPrint = false;
--     Seed = 0;
--     Steps = {
--      {Name = "AntiTamper";Settings = {UseDebug = false;}};
--      {Name = "NumbersToExpressions";Settings = {}},
--      {Name = "EncryptStrings";Settings = {}},
--      {Name = "ConstantArray";Settings = {Treshold = 1;StringsOnly = true;Shuffle = true;Rotate = false;LocalWrapperTreshold = 0}},
--      {Name = "Vmify";Settings = {}},
--  }
--     };
-- ["Strong"] = {
--     LuaVersion = "Lua51";
--     VarNamePrefix = "";
--     NameGenerator = "Mangled";
--     PrettyPrint = false;
--     Seed = 0;
--     Steps = {
--         { Name = "EncryptStrings"; Settings = {}};
--         { Name = "AntiTamper";Settings = {UseDebug = false}};
--         { Name = "Vmify"; Settings = {}};
--         { Name = "AddVararg"; Settings = {}};
--         { Name = "ConstantArray"; Settings = {Treshold = 0; StringsOnly = true; Shuffle = true; Rotate = true; LocalWrapperTreshold = 0; }};
--         { Name = "EncryptStrings"; Settings = {}; };
--         { Name = "SplitStrings"; Settings = {CustomFunctionType = 'local'; ConcatenationType = 'custom'; CustomLocalFunctionsCount = 1;}};
--         { Name = "EncryptStrings"; Settings = {}};
--         { Name = "ProxifyLocals"; Settings = {}};
--         { Name = "AddVararg"; Settings = {}; };
--         --{ Name = "WrapInFunction";Settings = {}};
--     }
--   },
-- }

--# Old Aspect Settings #--
-- return {
--     ["Minify"] = {
--         LuaVersion = "Lua51";
--         VarNamePrefix = "";
--         NameGenerator = "MangledShuffled";
--         PrettyPrint = false;
--         Seed = 0;
--         Steps = {}
--     };
--     ["Free"] = {
--         LuaVersion = "Lua51";
--         VarNamePrefix = "aspect_free_";
--         NameGenerator = "MangledShuffled";
--         PrettyPrint = false;
--         Seed = 0;
--         Steps = {
--             {
--                 Name = "Vmify";
--                 Settings = {

--                 };
--             },
--             {
--                 Name = "ConstantArray";
--                 Settings = {
--                     Treshold    = 1;
--                     StringsOnly = true;
--                 }
--             },
--         }
--     };
--     ["Premium"] = {
--         LuaVersion = "Lua51";
--         VarNamePrefix = "aspect_premium_";
--         NameGenerator = "MangledShuffled";
--         PrettyPrint = false;
--         Seed = 0;
--         Steps = {
--             {
--                 Name = "EncryptStrings";
--                 Settings = {

--                 };
--             },
--             {
--                 Name = "Vmify";
--                 Settings = {

--                 };
--             },
--             {
--                 Name = "ConstantArray";
--                 Settings = {
--                     Treshold             = 1;
--                     StringsOnly          = true;
--                     Shuffle              = true;
--                     Rotate               = true;
--                     LocalWrapperTreshold = 0;
--                 }
--             },
--             {
--                 Name = "NumbersToExpressions";
--                 Settings = {

--                 }
--             },
--         }
--     };
--     ["Administration"] = {
--         LuaVersion = "Lua51";
--         VarNamePrefix = "aspect_";
--         NameGenerator = "MangledShuffled";
--         PrettyPrint = false;
--         Seed = 0;
--         Steps = {
--             {
--                 Name = "EncryptStrings";
--                 Settings = {

--                 };
--             },
--             {
--                 Name = "AntiTamper";
--                 Settings = {
--                     UseDebug = false;
--                 };
--             },
--             {
--                 Name = "Vmify";
--                 Settings = {

--                 };
--             },
--             {
--                 Name = "ConstantArray";
--                 Settings = {
--                     Treshold             = 1;
--                     StringsOnly          = true;
--                     Shuffle              = true;
--                     Rotate               = true;
--                     LocalWrapperTreshold = 0;
--                 }
--             },
--             {
--                 Name = "NumbersToExpressions";
--                 Settings = {
--                     iterations = 1;
--                 }
--             },
--         }
--     };
-- }
