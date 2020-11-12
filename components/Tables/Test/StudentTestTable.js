import React from 'react'
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

export default function StudentTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)
	// const [ data, setData ] = React.useState([])
	// const [ columns, setColumns ] = React.useState([])
	React.useEffect(() => {
		
	}, [props.tests])

	const expandedRowRender = () => {
		const columns = [
			{
				title: 'Attempt',
				key: 'attempt',
				render: () => (
					<span>
						<Badge status="success" />
						Practise
					</span>
				),
			},
			{ title: 'Time', dataIndex: 'time', key: 'time' },
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				render: () => (
					<Space size="middle">
						<a>Pause</a>
						<a>Stop</a>
						<Dropdown overlay={menu}>
							<a>
								More <DownOutlined />
							</a>
						</Dropdown>
					</Space>
				),
			},
		];

		const data = [];
		for (let i = 0; i < 3; ++i) {
			data.push({
				key: i,
				date: '2014-12-24 23:12:00',
				name: 'This is production name',
				upgradeNum: 'Upgraded: 56',
			});
		}
		return(
			<>
				<div className="text-right">
					<div className="btn btn-primary">
						Start Test
					</div>
				</div>
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
		{ title: 'Action', key: 'operation', render: () => <a>Start Test</a> },
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