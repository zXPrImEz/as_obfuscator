local function script_path()
	local str = debug.getinfo(2, "S").source:sub(2)
	return str:match("(.*[/%\\])")
end
package.path = script_path() .. "?.lua;" .. package.path;
---@diagnostic disable-next-line: different-requires
local Aspect = require("aspect");
Aspect.Logger.logLevel = Aspect.Logger.LogLevel.Info;

local function file_exists(file)
    local f = io.open(file, "rb")
    if f then f:close() end
    return f ~= nil
end
  
local function lines_from(file)
    if not file_exists(file) then return {} end
    local lines = {}
    for line in io.lines(file) do 
      lines[#lines + 1] = line
    end
    return lines
  end

local config;
local sourceFile;
local outFile;
local luaVersion;
local prettyPrint;

Aspect.colors.enabled = true;

local i = 1;
while i <= #arg do
    local curr = arg[i];
    if curr:sub(1, 2) == "--" then
        if curr == "--preset" or curr == "--p" then
            if config then
                Aspect.Logger:warn("The config was set multiple times");
            end

            i = i + 1;
            local preset = Aspect.Presets[arg[i]];
            if not preset then
                Aspect.Logger:error(string.format("A Preset with the name \"%s\" was not found!", tostring(arg[i])));
            end

            config = preset;
        elseif curr == "--config" or curr == "--c" then
            i = i + 1;
            local filename = tostring(arg[i]);
            if not file_exists(filename) then
                Aspect.Logger:error(string.format("The config file \"%s\" was not found!", filename));
            end

            local content = table.concat(lines_from(filename), "\n");
            local func = loadstring(content);
            setfenv(func, {});
            config = func();
        elseif curr == "--out" or curr == "--o" then
            i = i + 1;
            if(outFile) then
                Aspect.Logger:warn("The output file was specified multiple times!");
            end
            outFile = arg[i];
        elseif curr == "--nocolors" then
            Aspect.colors.enabled = false;
        elseif curr == "--Lua51" then
            luaVersion = "Lua51";
        elseif curr == "--LuaU" then
            luaVersion = "LuaU";
        elseif curr == "--pretty" then
            prettyPrint = true;
        else
            Aspect.Logger:warn(string.format("The option \"%s\" is not valid and therefore ignored", curr));
        end
    else
        if sourceFile then
            Aspect.Logger:error(string.format("Unexpected argument \"%s\"", arg[i]));
        end
        sourceFile = tostring(arg[i]);
    end
    i = i + 1;
end

if not sourceFile then
    Aspect.Logger:error("No input file was specified!")
end

if not config then
    Aspect.Logger:warn("No config was specified, falling back to Minify preset");
    config = Aspect.Presets.Minify;
end

config.LuaVersion = luaVersion or config.LuaVersion;
config.PrettyPrint = prettyPrint ~= nil and prettyPrint or config.PrettyPrint;

if not file_exists(sourceFile) then
    Aspect.Logger:error(string.format("The File \"%s\" was not found!", sourceFile));
end

if not outFile then
    if sourceFile:sub(-4) == ".lua" then
        outFile = sourceFile:sub(0, -5) .. ".obfuscated.lua";
    else
        outFile = sourceFile .. ".obfuscated.lua";
    end
end

local source = table.concat(lines_from(sourceFile), "\n");
local pipeline = Aspect.Pipeline:fromConfig(config);
local out = pipeline:apply(source, sourceFile);
Aspect.Logger:info(string.format("Writing output to \"%s\"", outFile));

local handle = io.open(outFile, "w");
handle:write(out);
handle:close();