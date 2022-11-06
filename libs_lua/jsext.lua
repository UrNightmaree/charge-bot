local g = JS_G
local jsext = {}

function jsext.to_jsarray(arr)
	return _G:Array(table.unpack(arr))
end

function jsext.to_jsobject(tbl)
	local O = New(Object)

	for i,v in pairs(tbl) do
		O[i] = v
	end

	return O
end

return jsext
