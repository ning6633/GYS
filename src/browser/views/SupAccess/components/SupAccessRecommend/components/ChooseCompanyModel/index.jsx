import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { number, bool, string, array, object,func,oneOfType} from 'prop-types';
import _ from "lodash";
import { toJS } from 'mobx'
import { SHOW_ChooseCompany_MODEL } from "../../../../../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card  } from 'antd';
import { supplierAction } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;



@inject('toggleStore')
@observer
class ChooseCompanyModel extends React.Component {
    state = {
        list: [],
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows: [], 
        loading: false,
    };
    handleOk = e => {
        const { toggleStore,chooseFinishFn ,list} = this.props;
        const { selectedRowKeys,selectedRows } = this.state
      //  let selectData = _.find(list.list, { id: selectedRowKeys[0] })
        chooseFinishFn(selectedRows);
        toggleStore.setToggle(SHOW_ChooseCompany_MODEL)
    };
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys,selectedRows });
    
    };
   
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle( SHOW_ChooseCompany_MODEL)
    };
    componentDidMount() {
      
    }
    render() {
        const { toggleStore,list,pagination ,comparedList=[]} = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          type:'radio',
            // getCheckboxProps:record => ({
            //     //匹配校验数据
            //     disabled: _.findIndex(toJS(comparedList),{id:record.id})===-1?false:true,
            // })

        };
        const  columns=[
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '单位名称',
                dataIndex: 'name',
                width: 200,
                // fixed: "left",
                align: "center",
            },
            {
                title: '简称',
                dataIndex: 'code',
                width: 200,
                align: "center",
              
            },
         
    
        ];
        return (
            <div>
               
                <Modal
                    title={`选择场所`}
                    visible={toggleStore.toggles.get( SHOW_ChooseCompany_MODEL)}
                    width={960}
                    // bodyStyle={{
                    //     height:'50vh'
                    // }}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={<Search placeholder="搜索" onSearch={value =>{} } enterButton />}>
                        <Table size='middle' loading={loading} bordered={true} rowKey={(text,key) => text.id||key} rowSelection={rowSelection} columns={columns} pagination={{...pagination}} dataSource={[]} />
                    </Card>
                </Modal>
            </div>
        );
    }
}
ChooseCompanyModel.propTypes = {
    pagination:oneOfType([object,bool]),   // 分页配置
    list:oneOfType([object]),  // 数据列表包含list，以及total总数
   
}
export default Form.create({ name: 'ChooseCompanyModel' })(ChooseCompanyModel);