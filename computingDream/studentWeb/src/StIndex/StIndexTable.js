/**
 * Created by abing on 2017/3/15.
 */

import React,{Component} from 'react'
import {Table,Button} from 'antd'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../common/constDefine'



export default class StIndexTable extends Component{

	constructor(props){
		super(props);

		this.state={
			record:null,
			index:null,
		}
	}

	getTaskState = (data) =>{
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};

	getColumns = () => {
		const {onDetail} = this.props;
		return[
			{
				title:'#',
				render:(text,record,index) => {
					return index + 1;
				},
			},{
				
				title:'题目类型',
				dataIndex:'typeName',
				key:'typeName',
			},
			{
				title:'任务名称',
				dataIndex:'title',
				key:'title',
			},
			{
				title:'开始时间',
				dataIndex:'startTime',
				key:'startTime',
			},
			{
				title:'截止时间',
				dataIndex:'deadLine',
				key:'deadLine',
			},
			
			{
				title:'答题',
				key: 'action',
				render:(text,record,index) => {
					const taskState = this.getTaskState(record);
					console.log(taskState);
					if(taskState === TASK_STATE_FINISH){
						return (
							<Button size="small" type="success" >完成</Button>
						);
					} else if(taskState === TASK_STATE_EXPIRE){
						return (
							<span style={{color:'red'}}>过期</span>
						);
					} else {
						return (
							<Button size="small" type="primary" onClick={() => onDetail(record,index,taskState)} >去完成</Button>
						);
					}
				},
			}
		];
	};
	//对任务列表按照截止时间排序
	sortTaskList(data){
		const taskList=[];
		const finishedTask=[];
		const doingTask=[];
		for(var p in data){
			if(!this.isExpire(data[p],5)){
				continue;
			}
			switch(data[p].type){
				case 1:data[p].typeName="课前预习";break;
				case 2:data[p].typeName="课后作业";break;
				case 3:data[p].typeName="实验练习";break;
				case 4:data[p].typeName="每周总结";break;
				default:data[p].typeName="ERROR";break;
			}
			const taskState = this.getTaskState(data[p]);
			if(taskState === TASK_STATE_FINISH){
				finishedTask.push(data[p]);
			}
			if(taskState=== TASK_STATE_DOING){
				doingTask.push(data[p]);
			}
		}
		//console.log(finishedTask)
		
		finishedTask.sort(this.cmp);
		doingTask.sort(this.cmp);
		for(var i in doingTask){
			taskList.push(doingTask[i]);
		}
		for(var j in finishedTask){
			taskList.push(finishedTask[j]);
		}
		
		return eval(JSON.stringify(taskList));

	}

	//排序函数
	cmp(x,y){
		if(x.deadLine>y.deadLine){
			return 1;
		}
		else{
			return -1;
		}
	}


	//判断当前时间和截止时间是否在n天以内
	isExpire(data,n){
		//把字符串转换为时间Date对象
		var arr1 = data.deadLine.split(" "); 
		var sdate = arr1[0].split('-'); 
		var deadLineDate = new Date(sdate[0], sdate[1]-1, sdate[2]); 
		if(!deadLineDate){
			return true;
		}else{
			var now=new Date();
			if(deadLineDate-now<86400000*n){//把n天转换为毫秒数
				return true;
			}
			else{
				return false;
			}
		}
	}


	render(){
		const{data,loading}=this.props;	
		


		return(
			<div>
				<Table columns={this.getColumns()}
				       dataSource={this.sortTaskList(data)}
				       loading={loading}
				       rowKey={record => record.id}
				       pagination={false}
				/>
				

			</div>

		);
	}
}