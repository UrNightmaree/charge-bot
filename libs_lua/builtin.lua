local js = require 'js'
local g = js.global
JS_G = g

package.path = "./libs_lua/?.lua;./libs_lua/?/init.lua;"..package.path
package.jspath = "./libs_lua/?.js;"..package.jspath

String = g.String
Number = g.Number
Function = g.Function
Array = g.Array
Object = g.Object

New = js.new

console = g.console
process = g.process
