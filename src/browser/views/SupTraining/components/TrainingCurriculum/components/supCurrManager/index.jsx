import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Tree, Button, Tooltip, Select, Empty, Icon, Divider, Popconfirm, message } from 'antd';
import { supplierTrain } from '../../../../../../actions'
import { SHOW_addRoot_MODEL, SHOW_addChildren_MODEL } from "../../../../../../constants/toggleTypes"
const { TreeNode } = Tree;
const { Option } = Select;
import "./index.less";
import { observer, inject, } from 'mobx-react';
import AddRootDirectory from '../addRootDirectory'
import AddChildrenDirectory from '../addChildrenDirectory'

@inject('toggleStore', 'directoryStore', 'trainStore')
@observer
class SupCurrManager extends Component {
    state = {
        managerTree: [],
        selectRowKeys: [],
        event: [],
        statuss: 0,
        n:true
    }


    addRootDirectory = () => {
        //新建根目录
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addRoot_MODEL)
    }
    addChildrenDirectory = () => {
        // 添加子元素节点
        this.setState({
            statuss: 0
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addChildren_MODEL)
    }
    async delete() {
        //删除节点
        let { event } = this.state
        let { getSubCoursetype, onSelectManager, toggleStore, managerTree } = this.props
        let ret = await supplierTrain.getCoursetype(event.selectedNodes[0].props.dataRef.id)
        if(ret.code == 200 ){
            if (ret.data[0].children.length == 0) {
                let res = await supplierTrain.deleteCoursetype(event.selectedNodes[0].props.dataRef.id)
                if (res.code == 200) {
                    this.setState({
                        selectRowKeys: [],
                        event: [],
                    })
                    getSubCoursetype()
                    onSelectManager(managerTree[0])
                } else {
                    message.error("删除失败！")
                }
            } else {
                message.warning("该节点拥有子节点，不可删除!")
            }
        }
    }
    async updata() {
        //修改详情
        this.setState({
            statuss: 10
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addChildren_MODEL)

    }
    onSelect(selectRowKeys, event) {
        // 选中状态
        let { onSelectManager } = this.props
        this.setState({
            selectRowKeys, event
        })
        onSelectManager(event)
    }
    componentDidMount = () => {
        
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        let {selectRowKeys,event,n} = this.state
        if (nextProps.managerTree.length > 0) {
            if(n){
                if(selectRowKeys.length == 0){
                    let _obj = {
                        event: "select",
                        selected: true,
                        selectedNodes: [
                            {
                                props: {
                                    dataRef: {
                                        ...nextProps.managerTree[0]
                                    }
                                }
                            }
                        ]
                    }
                    this.state.selectRowKeys = nextProps.managerTree[0].id
                    this.state.event = _obj
                    nextProps.onSelectManager(_obj)
                }else{
                    nextProps.onSelectManager(event)
                }
                this.state.n = false
            }
            return true
        } else {
            return true
        }
    }

    gettreenode(tree, key = 0) {
        //生成目录树
        return tree.map((treenode, idx) => {
            return (
                <TreeNode dataRef={treenode} title={treenode.name} key={[key + '' + idx]}>
                    {
                        treenode.children !== null && treenode.children.length > 0 ? (

                            this.gettreenode(treenode.children, key + '' + idx)
                        ) : null
                    }</TreeNode>
            )
        })
    }

    render() {
        let { selectRowKeys, event, statuss } = this.state
        let { toggleStore, getSubCoursetype, managerTree, trainStore } = this.props
        return (
            <Fragment >
                {/* 消除react默认点击事件 */}
                <div style={{ height: 35 }} onMouseDown={(e) => {
                    e.preventDefault();
                    return false;
                }}>
                    {
                        managerTree.length == 0 ? <Button icon="plus" type="primary" onClick={() => { this.addRootDirectory() }} >新建根目录</Button> : <div className="functionZone">
                            <Tooltip placement="top" title="编辑">
                                <Button className="m-r-5" shape="circle" icon="edit" disabled={selectRowKeys.length == 0} onClick={e => this.updata()} />
                            </Tooltip>
                            <Tooltip placement="top" title="移除">
                                <Popconfirm
                                    title="确定要删除此分类吗？"
                                    onConfirm={ev => { this.delete() }}
                                    placement="bottom"
                                    disabled={selectRowKeys.length == 0}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button className="m-r-5" title="移除" shape="circle" icon="minus" disabled={selectRowKeys.length == 0} />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip placement="top" title="添加">
                                <Button className="m-r-5" title="添加" shape="circle" icon="plus" disabled={selectRowKeys.length == 0} onClick={e => { this.addChildrenDirectory() }} />
                            </Tooltip>
                        </div>
                    }
                </div>
                {managerTree.length > 0 ? <Tree defaultExpandAll showLine={true} defaultExpandedKeys={['0']} defaultSelectedKeys={["00"]}
                    onSelect={(selectRowKeys, event) => { this.onSelect(selectRowKeys, event) }}>
                    {
                        this.gettreenode(managerTree)
                    }
                </Tree> : null}

                {toggleStore.toggles.get(SHOW_addRoot_MODEL) && <AddRootDirectory getSubCoursetype={getSubCoursetype.bind(this)} />}
                {toggleStore.toggles.get(SHOW_addChildren_MODEL) && <AddChildrenDirectory statuss={statuss} event={event} getSubCoursetype={getSubCoursetype.bind(this)} />}
            </Fragment>
        )
    }
}

SupCurrManager.propTypes = {
    title: string
}
export default SupCurrManager;