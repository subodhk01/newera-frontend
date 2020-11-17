import React from 'react'
import Link from 'next/link'
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../utils/axios';

const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

export default function StudentTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)
	// const [ insideLoading, setInsideLoading ] = React.useState(true)
	// const [ insideError, setInsideError ] = React.useState(false)
	// const [ data, setData ] = React.useState([])
	// const [ columns, setColumns ] = React.useState([])
	React.useEffect(() => {
		
	}, [props.tests])

	const expandedRowRender = (row) => {
		let data = [];
		const columns = [
			{
				title: 'Attempt',
				key: 'attempt',
				render: (attempt) => {
					return (
						<span>
							{attempt.practice ? <Badge status="warning" /> : <Badge status="success" />}
							{attempt.practice ? "Practise" : "Real"}
						</span>
					)
				},
			},
			{ 
				title: 'Time', 
				dataIndex: 'time', 
				key: 'time',
				render: (time) => (
					<span>{(new Date(time)).toLocaleString()}</span>
				)
			},
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				render: () => (
					<Space size="middle">
						<a>Pause</a>
						<a>Stop</a>
					</Space>
				),
			},
		];
		props.sessions.map((session, index) => {
			if(session.test === row.id){
				data.push({
					key: index,
					practice: session.practice,
					time: session.checkin_time,
				})
			}
		})
		return(
			<>
				{/* <div className="text-right">
					<div className="btn btn-primary">
						Start Test
					</div>
				</div> */}
				<div className="w-75 mx-auto">
					<Table columns={columns} dataSource={data} pagination={false} />
				</div>
			</>	
		)
	};

	const columns = [
		{ title: 'TestId', dataIndex: 'id', key: 'id' },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Status', dataIndex: 'status', key: 'status' },
		{ title: 'Action', key: 'operation', render: (test) => 
			<Link href={`/test/attempt/${test.id}`}>
				<a>
					<div className="btn btn-primary">
						Start Test
					</div>
				</a>
			</Link>
		},
	];

	const data = [];
	props.tests && props.tests.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			name: item.name
		})
	})

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					expandable={{ expandedRowRender }}
					dataSource={data}
				/>
			}
		</>
	);
}