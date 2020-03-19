import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Tree, Button, Tooltip, Select, Empty, Icon, Divider, Popconfirm, message } from 'antd';
import { supplierDirectory ,supplierTrain } from "../../../../../../actions"
const { TreeNode } = Tree;
const { Option } = Select;
import "./index.less";
 import NewClassModel from "../NewClassModel";
import { observer, inject, } from 'mobx-react';
import { SHOW_NEWCLASS_MODEL } from "../../../../../../constants/toggleTypes"

@inject('toggleStore', 'directoryStore')
@observer
class SchemeTypesTree extends Component {
    state = {
        treedata: [

        ],
        rootCategorys: [],
        defaultCategoryValue: null,
        currentDirectory:undefined

    }
    gettreenode(tree, key = 0) {
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

    onSelect = (selectedKeys, event) => {
        console.log(event)
        if (event.selected) {
            let itemData = event.selectedNodes[0].props.dataRef
            console.log(itemData)
            this.setState({
                currentDirectory:itemData
            }) 
        } else {
            this.setState({
                currentDirectory:null
            }) 
        }

    };

    editClass(data) {
        const { toggleStore, directoryStore, currentDirectory } = this.props;
        if (data) {
            directoryStore.isClassEditor = true
            directoryStore.isNewClass = false
            directoryStore.isNewRootClass = false
            toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
        }

    }
    async removeClass(data) {
        const { clearCurrDir } = this.props;
        console.log(data)
        if (data.children && data.children.length > 0) {
            message.warning('分类下有子节点，不可删除')
            return
        }
        let deleteArr = new Array(data.id)
        let ret = await supplierTrain.removeTrainSchmeType(deleteArr)
        if (ret.code == 200) {
            message.success('分类删除成功！')
            if (!data.parentid) {
                this.getRootCategory()
            } else {
                this.getCategoryTree(data.parentid)
            }
            clearCurrDir()
        }
    }
    addClass(e) {
        const { toggleStore, directoryStore } = this.props;
        directoryStore.isClassEditor = false
        directoryStore.isNewClass = true
        directoryStore.isNewRootClass = false
        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
    }
    addRootCategory() {
        const { toggleStore, directoryStore } = this.props;
        directoryStore.isNewRootClass = true
        directoryStore.isNewClass = false
        directoryStore.isClassEditor = false
        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
    }

    //默认获取根名录分类
    async getRootCategory(categoryId) {
        const { clickDirectory } = this.props;

        let list = await supplierDirectory.getRootCategory()
        console.log(list)
        if (list.length > 0) {
            this.getCategoryTree(categoryId ? categoryId : list[0].id)
            clickDirectory(list[0])
            this.setState({
                rootCategorys: list,
                defaultCategoryValue: categoryId ? categoryId : list[0].id
            })
        } else {
            this.getCategoryTree(null)
        }
    }


    //获取新建根分类下的树，以及获取新根分类下的名录
    async getNewRootCategory(categoryId) {
        const { clickDirectory } = this.props;

        let list = await supplierDirectory.getRootCategory()
        if (list.length > 0) {
            //获取根分类结构
            this.getCategoryTree(categoryId)
            let RootDirect = list.find(item => { return item.id == categoryId })
            clickDirectory(RootDirect)
            this.setState({
                rootCategorys: list,
                defaultCategoryValue: categoryId
            })

        }
    }
    //获取分类树
    async getCategoryTree() {
        let tree = await supplierTrain.getTrainSchmeTypeTree()
        console.log(tree)
        if (tree.code == 200) {
            this.setState({
                treedata: tree.data,
            })
        } else {
            this.setState({
                treedata: [],
                rootCategorys: [],
                defaultCategoryValue: null
            })
        }
    }


    handleChange(value, data) {
        this.getCategoryTree(value)
        const { getDirectByCategoryId } = this.props;
        getDirectByCategoryId(value)
        this.setState({
            defaultCategoryValue: value
        })
    }
    componentDidMount() {
        this.getCategoryTree()

    }
    loaddata(categoryId, idNew) {
        console.log(categoryId)
        if (idNew) {
            this.getNewRootCategory(categoryId)
        } else {


            this.getCategoryTree(categoryId ? categoryId : this.state.defaultCategoryValue)
        }
    }
    render() {
        let { toggleStore,  } = this.props;
        let { rootCategorys,currentDirectory, defaultCategoryValue, treedata } = this.state

        return (
            <Fragment >
                {/* 消除react默认点击事件 */}
                <div onMouseDown={(e) => {
                    e.preventDefault();
                    return false;
                }}>
                    <div className="functionZone">

                        <Tooltip placement="top" title="编辑">
                            <Button className="m-r-5" shape="circle" disabled={!currentDirectory} icon="edit" onClick={e => this.editClass(currentDirectory)} />
                        </Tooltip>
                        <Tooltip placement="top" title="移除">
                            <Popconfirm
                                title="确定要删除此分类吗？"
                                onConfirm={ev => this.removeClass(currentDirectory)}
                                placement="bottom"
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button className="m-r-5" title="移除" disabled={!currentDirectory} shape="circle" icon="minus" />
                            </Popconfirm>

                        </Tooltip>
                        <Tooltip placement="top" title="添加">
                            <Button className="m-r-5" title="添加" shape="circle" icon="plus" onClick={e => this.addClass()} />
                        </Tooltip>

                        {/* <Select value={defaultCategoryValue} className="selectedZone" onChange={this.handleChange.bind(this)}

                            dropdownRender={menu => (
                                <div >
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ padding: '8px', cursor: 'pointer' }} onClick={e => this.addRootCategory()}  >
                                        <Icon type="plus" /> 添加根分类
                        </div>
                                </div>
                            )}
                        >
                            {
                                rootCategorys && rootCategorys.map(item => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                })
                            }

                        </Select> */}
                    </div>
                </div>

                {
                 treedata ? <Tree defaultExpandAll showLine={true} defaultExpandedKeys={['0']} onSelect={this.onSelect.bind(this)}>
                        {
                            this.gettreenode(treedata)
                        }
                    </Tree> : <Empty />
                }
                {
                    toggleStore.toggles.get(SHOW_NEWCLASS_MODEL) && <NewClassModel currentDirectory={currentDirectory} currCategory={defaultCategoryValue} refreshData={this.loaddata.bind(this)} />
                }
            </Fragment>
        )
    }
}

SchemeTypesTree.propTypes = {
    title: string
}
export default SchemeTypesTree;