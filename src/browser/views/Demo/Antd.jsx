import React, { Component } from 'react';
import { Button, Tag ,Alert ,Drawer ,message ,Modal ,Spin ,Icon ,Tree ,Steps ,Anchor ,Divider ,Table ,Row , Col,BackTop } from "antd";
import './Antd.less'

const success = () => {
    message.success('This is a message of success');
};

const error = () => {
    message.error('This is a message of error');
};

const warning = () => {
    message.warning('This is message of warning');
};

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const TreeNode = Tree.TreeNode;

const DirectoryTree = Tree.DirectoryTree;

const Step = Steps.Step;

const { Link } = Anchor;

const steps = [{
        title: 'First',
        content: 'First-content',
    }, {
        title: 'Second',
        content: 'Second-content',
    }, {
        title: 'Last',
        content: 'Last-content',
    }];

const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
            }, {
                title: '0-0-1',
                key: '0-0-1',
                children: [
                { title: '0-0-1-0', key: '0-0-1-0' },
                { title: '0-0-1-1', key: '0-0-1-1' },
                { title: '0-0-1-2', key: '0-0-1-2' },
                ],
            }, {
                title: '0-0-2',
                key: '0-0-2',
        }],
    }];
    const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
            <span>
                {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
            </span>
            ),
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
            <span>
                <a href="javascript:;">Invite {record.name}</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
            </span>
            ),
        }];
        
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }];



        class Grid extends Component{
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='grid' target="__blank" href='https://ant-design.gitee.io/components/grid-cn/'>antd栅格系统</a></Divider>
                        <div>
                            <span className='stronger'>基础栅格:</span>
                            <div>
                                <Row>
                                <Col span={12}>col-12</Col>
                                <Col span={12}>col-12</Col>
                                </Row>
                                <Row>
                                <Col span={8}>col-8</Col>
                                <Col span={8}>col-8</Col>
                                <Col span={8}>col-8</Col>
                                </Row>
                                <Row>
                                <Col span={6}>col-6</Col>
                                <Col span={6}>col-6</Col>
                                <Col span={6}>col-6</Col>
                                <Col span={6}>col-6</Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        class Warninghints extends Component{
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='warning-hints' target="__blank" href='https://ant-design.gitee.io/components/alert-cn/'>警告提示</a></Divider>
                        <p><span className='stronger'>应用场景:</span>
                            当某个页面需要向用户显示警告的信息时;
                            非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭
                        </p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <Alert message="Success Tips" type="success" showIcon />
                            <Alert message="Informational Notes" type="info" showIcon />
                            <Alert message="Warning" type="warning" showIcon />
                            <Alert message="Error" type="error" showIcon />
                        </div>
                    </div>
                )
            }
        }

        class RightSidePopUpBox extends Component{
            state = { visible: false };
            showDrawer = () => {
                this.setState({
                    visible: true,
                });
            };
            onClose = () => {
                this.setState({
                    visible: false,
                });
            };
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='right-side-pop-up-box' target="__blank" href='https://ant-design.gitee.io/components/drawer-cn/'>右侧弹出框</a></Divider>   
                        <p><span className='stronger'>应用场景:</span>
                            当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容;
                            当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象;</p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <Button type="primary" onClick={this.showDrawer}>点击右侧弹出</Button>
                            <Drawer
                                title="Create"
                                width={600}
                                placement="right"
                                onClose={this.onClose}
                                // maskClosable={false}
                                visible={this.state.visible}
                                style={{
                                    height: 'calc(100% - 55px)',
                                    overflow: 'auto',
                                    paddingBottom: 53,
                                }}>

                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%',
                                            borderTop: '1px solid #e8e8e8',
                                            padding: '10px 16px',
                                            textAlign: 'right',
                                            left: 0,
                                            background: '#fff',
                                            borderRadius: '0 0 4px 4px',
                                        }}>
                                    <Button
                                        style={{
                                            marginRight: 8,
                                        }}
                                        onClick={this.onClose}>
                                        Cancel
                                    </Button>
                                    <Button onClick={this.onClose} type="primary">Submit</Button>
                                    </div>
                            </Drawer>
                        </div>
                    </div>
                )
            }
        }


        class GlobalPrompting extends Component{
            state = { visible: false };
            showDrawer = () => {
                this.setState({
                    visible: true,
                });
            };
            onClose = () => {
                this.setState({
                    visible: false,
                });
            };
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='global-prompting'  target="__blank" href='https://ant-design.gitee.io/components/drawer-cn/'>全局提示</a></Divider>   
                                {/* <h2 id='global-prompting'><a target="__blank" href='https://ant-design.gitee.io/components/drawer-cn/'>全局提示</a></h2>   */}
                                <p><span className='stronger'>应用场景:</span> 
                                    可提供成功、警告和错误等反馈信息;
                                    顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式;
                                </p>              
                                <div>
                                    <span className='stronger'>效果:</span>
                                    <Button onClick={success}>Success</Button>
                                    <Button onClick={error}>Error</Button>
                                    <Button onClick={warning}>Warning</Button>
                                </div>
                    </div>
                )
            }
        }


        class CTreeCtrl extends Component{
            state = {
                expandedKeys: ['0-0-0', '0-0-1'],
                autoExpandParent: true,
                checkedKeys: ['0-0-0'],
                selectedKeys: [],
            };
            onExpand = (expandedKeys) => {
                console.log('onExpand', expandedKeys);
                this.setState({
                    expandedKeys,
                    autoExpandParent: false,
                });
            }
            
            onCheck = (checkedKeys) => {
                console.log('onCheck', checkedKeys);
                this.setState({ checkedKeys });
            }
            
            onSelect = (selectedKeys, info) => {
                console.log('onSelect', info);
                this.setState({ selectedKeys });
            }
            renderTreeNodes = (data) => {
                return data.map((item) => {
                if (item.children) {
                    return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                    );
                }
                return <TreeNode {...item} />;
                });
            }
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='CTreeCtrl' target="__blank" href='https://ant-design.gitee.io/components/tree-cn/'>树形控件</a></Divider>   
                        {/* <h2 id='CTreeCtrl'><a target="__blank" href='https://ant-design.gitee.io/components/tree-cn/'>树形控件</a></h2> */}
                        <p><span className='stronger'>应用场景:</span> 
                            文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构;
                            使用树控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能;
                        </p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <p className='stronger'>树状结构:</p>
                            <Tree
                                checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}>
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                        </div>
                        <div>
                            <p className='stronger'>内置的目录树:</p>
                            <DirectoryTree
                                multiple
                                defaultExpandAll
                                onSelect={this.onSelect}
                                onExpand={this.onExpand}
                            >
                                <TreeNode title="parent 0" key="0-0">
                                <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                                <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                                </TreeNode>
                                <TreeNode title="parent 1" key="0-1">
                                <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                                <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                                </TreeNode>
                            </DirectoryTree>
                        </div>
                    </div>
                )
            }
        }

        class IntermediatePopUpBox extends Component{
            state = { 
                modal1Visible: false,
                modal2Visible: false,
            };

            setModal1Visible(modal1Visible) {
                this.setState({ modal1Visible });
            }
            
            setModal2Visible(modal2Visible) {
                this.setState({ modal2Visible });
            }
            
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='Intermediate-pop-up-box' target="__blank" href='https://ant-design.gitee.io/components/modal-cn/'>中间弹出框</a></Divider>   
                        {/* <h2 id='Intermediate-pop-up-box'><a target="__blank" href='https://ant-design.gitee.io/components/modal-cn/'>中间弹出框</a></h2> */}
                        <p><span className='stronger'>应用场景:</span> 
                            需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作;
                            另外当需要一个简洁的确认框询问用户时，可以使用精心封装好的 antd.Modal.confirm() 等方法;
                        </p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <br/>
                            <Button type="primary" onClick={() => this.setModal1Visible(true)}>Display a modal dialog at 20px to Top</Button>
                            <Modal
                            title="20px to Top"
                            style={{ top: 20 }}
                            visible={this.state.modal1Visible}
                            onOk={() => this.setModal1Visible(false)}
                            onCancel={() => this.setModal1Visible(false)}
                            >
                            <Alert message="Success Tips" type="success" showIcon />
                            <Alert message="Informational Notes" type="info" showIcon />
                            <Alert message="Warning" type="warning" showIcon />
                            <Alert message="Error" type="error" showIcon />
                            </Modal>
                            <br/>
                            <br/>
                            <Button type="primary" onClick={() => this.setModal2Visible(true)}>Vertically centered modal dialog</Button>
                            <Modal
                                title="Vertically centered modal dialog"
                                centered
                                visible={this.state.modal2Visible}
                                onOk={() => this.setModal2Visible(false)}
                                onCancel={() => this.setModal2Visible(false)}
                            >
                            <Alert message="Success Tips" type="success" showIcon />
                            <Alert message="Informational Notes" type="info" showIcon />
                            <Alert message="Warning" type="warning" showIcon />
                            <Alert message="Error" type="error" showIcon />
                            </Modal>
                        </div>
                    </div>
                )
            }
        }

        class Load extends Component{
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='Load'  target="__blank" href='https://ant-design.gitee.io/components/spin-cn/'>加载中</a></Divider>   
                        {/* <h2 id='Load'><a target="__blank" href='https://ant-design.gitee.io/components/spin-cn/'>加载中</a></h2> */}
                        <p><span className='stronger'>应用场景:</span> 
                            页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。
                        </p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <div className="example">
                                <Spin size='large' indicator={antIcon} />
                            </div>
                            <div className="example">
                                <Spin size='large' tip='Loading'/>
                            </div>
                        </div>
                    </div>
                )
            }
        }


        class TablePage extends Component{
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='table-page'  target="__blank" href='https://ant-design.gitee.io/components/table-cn/'>表格</a></Divider>   
                        {/* <h2 id='Load'><a target="__blank" href='https://ant-design.gitee.io/components/spin-cn/'>加载中</a></h2> */}
                        <p><span className='stronger'>应用场景:</span> 
                            当有大量结构化的数据需要展现时；
                            当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。
                        </p>
                        <div>
                            <Table columns={columns} dataSource={data} />
                        </div>
                    </div>
                )
            }
        }

        class StepBar extends Component{

            constructor(props) {
                super(props);
                this.state = {
                    current: 0,
                };
            }
            next() {
                const current = this.state.current + 1;
                this.setState({ current });
            }
            
            prev() {
                const current = this.state.current - 1;
                this.setState({ current });
            }
            render(){
                const { current } = this.state;
                return(
                    <div>
                        <Divider orientation="left"><a id='Step-bar'  target="__blank" href='https://ant-design.gitee.io/components/table-cn/'>步骤条</a></Divider>   
                        {/* <h2 id='Step-bar'><a target="__blank" href='https://ant-design.gitee.io/components/table-cn/'>步骤条</a></h2>                 */}
                        <p>
                            <span className='stronger'>应用场景:</span>
                            当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。
                        </p>
                        <div>
                            <span className='stronger'>效果:</span>
                            <Steps current={current}>
                                {steps.map(item => <Step key={item.title} title={item.title} />)}
                                </Steps>
                                <div className="steps-content">{steps[current].content}</div>
                                <div className="steps-action">
                                {
                                    current < steps.length - 1
                                    && <Button type="primary" onClick={() => this.next()}>Next</Button>
                                }
                                {
                                    current === steps.length - 1
                                    && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                                }
                                {
                                    current > 0
                                    && (
                                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    Previous
                                    </Button>
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            <Steps>
                                <Step status="finish" title="Login" icon={<Icon type="user" />} />
                                <Step status="finish" title="Verification" icon={<Icon type="solution" />} />
                                <Step status="process" title="Pay" icon={<Icon type="loading" />} />
                                <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
                            </Steps>
                        </div>
                    </div>
                )
            }
        }


        class Anchors extends Component{
            render(){
                return(
                    <div>
                        <Divider orientation="left"><a id='Anchors'  target="__blank" href='https://ant-design.gitee.io/components/table-cn/'>锚点</a></Divider>   
                        {/* <h2 id='Anchors'><a target="__blank" href='https://ant-design.gitee.io/components/table-cn/'>锚点</a></h2>                 */}
                        <p>
                            <span className='stronger'>应用场景:</span>
                            当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。
                        </p>
                        <p>
                            <span className='stronger'>效果:</span>
                            右侧为展示效果
                        </p>
                        <div className='Anchors'>
                        <Anchor>
                        
                            <Link href="#grid" title="栅格系统" />
                            <Link href="#warning-hints" title="警告提示" />
                            <Link href="#right-side-pop-up-box" title="右侧弹出框" />
                            <Link href="#global-prompting" title="全局提示"/>
                            <Link href="#CTreeCtrl" title="树形控件" />
                            <Link href="#Intermediate-pop-up-box" title="中间弹出框" />
                            <Link href="#Load" title="加载中" />
                            <Link href="#table-page" title="表格" />
                            <Link href="#Step-bar" title="步骤条" />
                            <Link href="#Anchors" title="锚点" />
                        </Anchor>
                        </div>
                    </div>
                )
            }
        }
class Antd extends Component {

    render() {
        return (
            <div className='antdClass'>
                <p>此页面放有react ui 组件库 <a  target="__blank" href="https://ant-design.gitee.io/docs/react/introduce-cn">antd</a> 的使用介绍</p>
                <Grid/>
                <Warninghints/>
                <RightSidePopUpBox/>
                <GlobalPrompting/>
                <CTreeCtrl/>
                <IntermediatePopUpBox/>
                <Load/>
                <TablePage/>
                <StepBar/>
                <Anchors/>
                <BackTop/>
            </div>
        )
    }
}

export default Antd;