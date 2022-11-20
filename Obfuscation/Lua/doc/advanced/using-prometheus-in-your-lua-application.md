# Using Aspect in your Lua Application

Aspect can also be used as a library for your custom Lua Applications instead of using it's cli tool.&#x20;

In order to do that you'll first need to clone the github repo:

```batch
git clone "https://github.com/levno-710/Aspect.git"
```

After that, you'll need to copy everything within the src folder to your project. Let's say you created a folder named `aspect`, where all the Aspect files are located. You can the use the following code to obfuscate a string:

{% code title="use_aspect.lua" %}
```lua
local Aspect = require("aspect.aspect")

-- If you don't want console output
Aspect.Logger.logLevel = Aspect.Logger.LogLevel.Error

-- Your code
local code = 'print("Hello, World!")'

-- Create a Pipeline using the Strong preset
local pipeline = Aspect.Pipeline:fromConfig(Aspect.Presets.Strong)

-- Apply the obfuscation and print the result
print(pipeline:apply(code));
```
{% endcode %}

Instead of passing the Strong preset you could also pass a custom [Config Object](../getting-started/the-config-object.md).
