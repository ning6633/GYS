import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { number, bool, string, array, object,func,oneOfType} from 'prop-types';
import _ from "lodash";
import { toJS } from 'mobx'
import { SHOW_ChooseListModel_MODEL } from "../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card  } from 'antd';
import { supplierAction } from "../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;



@inject('toggleStore')
@observer
class ChooseListModel extends React.Component {
    state = {
        list: [],
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows: [], 
        loading: false,
    };
    handleOk = e => {
        const { toggleStore,chooseFinishFn ,list,options} = this.props;
        const { selectedRowKeys,selectedRows } = this.state
      //  let selectData = _.find(list.list, { id: selectedRowKeys[0] })
        chooseFinishFn(selectedRows);
        toggleStore.setToggle(options.model||SHOW_ChooseListModel_MODEL)
    };
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys,selectedRows });
    
    };
   
    handleCancel = e => {
        const { toggleStore,options } = this.props;
        toggleStore.setToggle(options.model || SHOW_ChooseListModel_MODEL)
    };
    componentDidMount() {
      
    }
    render() {
        const { toggleStore,list,options,pagination ,comparedList=[]} = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:options.type=='checkbox'? 'checkbox':'radio',
            getCheckboxProps:record => ({
                //匹配校验数据
                disabled: _.findIndex(toJS(comparedList),{id:record.id})===-1?false:true,
            })

        };
        return (
            <div>
               
                <Modal
                    title={options.title}
                    visible={toggleStore.toggles.get(options.model|| SHOW_ChooseListModel_MODEL)}
                    width={options.width?options.width:960}
                    // bodyStyle={{
                    //     height:'50vh'
                    // }}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={pagination && pagination.search?<Search placeholder="搜索" onSearch={value =>{pagination.search(value)} } enterButton />:null}>
                        <Table size='middle' loading={loading} bordered={true} rowKey={(text,key) => text.id||key} rowSelection={rowSelection} columns={options.columns} pagination={{...pagination}} dataSource={list.list||[]} />
                    </Card>
                </Modal>
            </div>
        );
    }
}
ChooseListModel.propTypes = {
    pagination:oneOfType([object,bool]),   // 分页配置
    list:oneOfType([object]),  // 数据列表包含list，以及total总数
   
}
export default Form.create({ name: 'ChooseListModel' })(ChooseListModel);