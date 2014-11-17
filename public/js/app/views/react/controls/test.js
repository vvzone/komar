/**
 * Created by Victor on 15.11.14.
 */


{ children = {}, config = "luci", deps = {}, description = "",
    map = {
        children = {
            { addremove = false, changed = false, children = { }, config = "luci", defaults = {}, description = "", dynamic = false,
                fields = { _fileupload =}
            }, map =, optional = true, optionals = {}, tag_deperror = {}, tag_error = {}, tag_invalid = {}, template = "cbi/nullsection", title = "",
    = { __index = { __init__ = , = { __call = , __index = { __init__ = , add_dynamic = , cfgvalue = , create = , has_tabs = , option = , parse_dynamic = , parse_optionals = , push_events = , remove = , render_tab = , tab = , taboption = , = { __call = ,
    __index ={ __init__ = , _run_hook = , _run_hooks = , append = , parse = , prepare = , render = , render_children = , = { __call = } } } } } } } } },
config = "luci", data = {}, description = "", dorender = true, pageaction = false, readinput = true, template = "cbi/simpleform", title = "File client.conf", upload_fields = {
        }, = { __index = { __init__ = , del = , field = , formvalue = , formvaluetable = , get = , get_scheme = , parse = , render = , section = , set = , submitstate = , = { __call = , __index =
        } } } }, option = "_fileupload", optional = false, rmempty = true, section =
    , subdeps = {}, tag_error = {}, tag_invalid = {}, tag_missing = {}, tag_reqerror = {}, template = "cbi/upload_openvpn", title = "Load file", track_missing = false, = { __index = { __init__ = , cfgvalue = , formcreated = , formvalue = , print = ,
    remove = , = { __call = , __index = { __init__ = , add_error = , additional = , cbid = , cfgvalue = , depends = , formcreated = , formvalue = , mandatory = ,
    parse = , prepare = , remove = , render = , transform = , validate = , write = , = { __call = , __index =
        } } } } } }