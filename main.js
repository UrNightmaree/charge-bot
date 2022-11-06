"use strict";

const path = require("path");

const {
	FENGARI_COPYRIGHT,
	to_luastring,
	lua: {
		LUA_ERRSYNTAX,
		LUA_OK,
		LUA_REGISTRYINDEX,
		lua_pcall,
		lua_tostring,
		lua_pop,
		lua_pushstring,
		lua_setfield,
		lua_setglobal,
		lua_getglobal,
		lua_getfield,
		lua_tojsstring
	},
	lauxlib: {
		LUA_LOADED_TABLE,
		luaL_checkstack,
		luaL_getsubtable,
		luaL_dofile,
		luaL_loadfile,
		luaL_newstate,
		luaL_requiref
	},
	lualib: {
		luaL_openlibs
	}
} = require('fengari');
const {
	luaopen_js,
	push,
	tojs
} = require('fengari-interop');

const L = luaL_newstate();

/* open standard libraries */
luaL_openlibs(L);
/* js lib */
luaL_requiref(L, to_luastring("js"), luaopen_js, 0);
lua_pop(L, 1); /* remove lib */

const registerLib = function(libname,reqname) {
	luaL_getsubtable(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
	push(L, require(libname));
	lua_setfield(L, -2, to_luastring(reqname));  /* LOADED[modname] = module */
	lua_pop(L, 1); /* remove LOADED */
};

registerLib("eris","eris");
registerLib("dotenv","dotenv");

/*if (! test)
	throw "no";*/

luaL_dofile(L,
	to_luastring(path.join(__dirname,"libs_lua/builtin.lua")));

lua_pushstring(L, to_luastring(FENGARI_COPYRIGHT));
lua_setglobal(L, to_luastring("_COPYRIGHT"));

let ok = luaL_loadfile(L, to_luastring(path.join(__dirname, "main.lua")));
if (ok === LUA_ERRSYNTAX) {
	throw new SyntaxError(lua_tojsstring(L, -1));
}
if (ok === LUA_OK) {
	/* Push process.argv[2:] */
	luaL_checkstack(L, process.argv.length-2, null);
	for (let i=2; i<process.argv.length; i++) {
		push(L, process.argv[i]);
	}
	ok = lua_pcall(L, process.argv.length-2, 0, 0);
}
if (ok !== LUA_OK) {
	let e = tojs(L, -1);
	lua_pop(L, 1);
	throw e;
}
