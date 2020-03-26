import Vue from 'vue'
import {
  Message, Form,
  FormItem, Card, Cascader,
  Table, TableColumn, Row, Col,
  Pagination, Input, Button,
  Container, Header, Dropdown, DropdownMenu,
  DropdownItem, Aside, Menu, Main, Submenu,
  MenuItem, Breadcrumb, BreadcrumbItem, Dialog,
  Select, Switch, Tooltip, MessageBox, Option,
  Tree, Tag, Alert, Steps, Step, Tabs, TabPane, Upload,
  Timeline, TimelineItem
  
} from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox
// Vue.use(Element)
Vue.use(Alert)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(BreadcrumbItem)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dropdown)
Vue.use(Container)
Vue.use(Header)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Card)
Vue.use(Cascader)
