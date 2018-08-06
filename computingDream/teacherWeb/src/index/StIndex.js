import React,{Component} from 'react'
import './StIndex.css'
import StIndexTable from './StIndexTable'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import {connect} from 'react-redux'
import {HostPost} from '../ajax'
import {notification} from 'antd'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../common/constDefine'


class StIndex extends Component{
    constructor(props) {
		super(props);
		this.state={
			loading:true,
		}
    }

	componentDidMount(){
		const {taskIndex} = this.props;
		//if(!taskIndex){
			HostPost('/get-task-list-ex',{taskTypes:[1,2,3,4]},true).then(({json}) => {
				if(json.error === 0){
					let data = {'taskIndex':json.list};
					this.props.updateTaskLists(data);
					this.setState({loading:false});
				} else {
					this.setState({loading:true});
					throw json;
				}
			}).catch((error) => {
				this.setState({loading:false});
				// console.log(error);
				notification.error({
					message: '温馨提示',
					description: '获取用户数据失败.',
				});
			});
		// }else {
		// 	this.setState({loading:false});
		// }
	}

	getTaskState = (data) =>{
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};


	handleTaskDetail = (record,index,state) => {
		if(record.type===4){
			this.props.router.push('/summary');
		}else{
		this.props.router.push('/practice/question/'+record.id + '/' + record.type);}
	};

	

	render(){
		const {taskIndex} = this.props;
		const {loading} = this.state;
		
		return (
			<div className="StIndex-content">
				<h1>首页</h1>
				<div>
					<h2>近期任务</h2>
					
					<StIndexTable data={taskIndex} loading={loading} onDetail={this.handleTaskDetail}/>
				</div>
				
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return{
		taskIndex:state.task.taskIndex,
	}
};

const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};
export default  connect(mapStateToProps,mapDispatchToProps)(StIndex);