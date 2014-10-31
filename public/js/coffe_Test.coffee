MenuBlock = React.createClass
  getInitialState:->
    selected: null
    menu_array: []
  clickHandle:(event)->
    this.setState({selected : event.data.id})
  componentDidMount: ()->
    console.info('mounted...')
  render:->
    wrap = (item)->
      selected = if this.selected = item.id then "selected" else ""
      "<div className=#{selected} onClick=#{this.clickHandle}>#{item.name}</div>"
    wrap item for item in this.props.menu_array;


Tree = React.createClass
  render:->
    if this.node.childs? then child for child in this.node.childs
