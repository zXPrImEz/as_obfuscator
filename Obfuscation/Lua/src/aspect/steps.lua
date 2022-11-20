return {
	WrapInFunction = require("aspect.steps.WrapInFunction");
	SplitStrings   = require("aspect.steps.SplitStrings");
	Vmify          = require("aspect.steps.Vmify");
	ConstantArray  = require("aspect.steps.ConstantArray");
	ProxifyLocals  = require("aspect.steps.ProxifyLocals");
	AntiTamper  = require("aspect.steps.AntiTamper");
	EncryptStrings = require("aspect.steps.EncryptStrings");
	NumbersToExpressions = require("aspect.steps.NumbersToExpressions");
	AddVararg 	= require("aspect.steps.AddVararg");
}