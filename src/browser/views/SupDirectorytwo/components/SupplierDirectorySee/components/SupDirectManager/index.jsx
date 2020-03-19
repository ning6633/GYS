import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Tree, Button, Tooltip, Select, Empty, Icon, Divider, Popconfirm, Upload, message } from 'antd';
import { supplierDirectory } from "../../../../../../actions"
const { TreeNode } = Tree;
const { Option } = Select;
import "./index.less";
import { observer, inject, } from 'mobx-react';
import { SHOW_NEWCLASS_MODEL } from "../../../../../../constants/toggleTypes"

@inject('toggleStore', 'directoryStore')
@observer
class SupDirectManager extends Component {
    state = {
        selectNode: []
    }

    // 解析树结构
    gettreenode(tree, key = 0) {
        return tree.map((treenode, idx) => {
            return (
                <TreeNode dataRef={treenode} title={`${treenode.name}  ${treenode.childrencount}`} key={[key + '' + idx]}>
                    {
                        treenode.children !== null && treenode.children.length > 0 ? (
                            this.gettreenode(treenode.children, key + '' + idx)
                        ) : null
                    }</TreeNode>
            )
        })
    }



    // 点击树节点触发的点击事件
    onSelectTree(selectedKeys, e) {
        // console.log("点击树节点事件", selectedKeys, e)
        let {onSelectTree} = this.props
        onSelectTree(selectedKeys, e)
    }

    // 点击下拉菜单
    onSelect = (e)=>{
        let {onSelect} = this.props
        onSelect(e)
    }

    loaddata = () => {
        let { getSubCategories } = this.props
        getSubCategories()
    }
    componentDidMount = () => {

    }
    componentDidUpdate(){
        return true
    }
    render() {
        const _that = this
        let { upload, treeData, getSubCategories, selectNode ,onSelectInfo} = this.props
        return (
            <Fragment >
                
                    <div>
                        <Select style={{ width: "120px", marginLeft: "5px" }} value={onSelectInfo} onSelect={this.onSelect}>
                            {selectNode.map((item, index) => {
                                return <Option value={item} key={item}>{item}</Option>
                            })}
                        </Select>
                        <Tree
                            showLine={true}
                            showIcon={true}
                            onSelect={this.onSelectTree.bind(this)}
                        >
                            {
                                this.gettreenode(treeData)
                            }
                        </Tree>
                    </div>
                

            </Fragment>
        )
    }
}

SupDirectManager.propTypes = {
    title: string
}
export default SupDirectManager;