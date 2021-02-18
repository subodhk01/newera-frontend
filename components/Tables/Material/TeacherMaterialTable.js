import React from 'react'
import Link from 'next/link'
import { FaPencilAlt } from 'react-icons/fa'
import { Table, Menu, Empty } from 'antd';

export default function TeacherMaterialTable(props) {
	const [ loading, setLoading ] = React.useState(false)

	const columns = [
		{ title: 'MaterialId', dataIndex: 'id', key: 'id' },
		{ title: 'Title', dataIndex: 'title', key: 'tilte' },
		{ title: 'Link', key: 'link', render: (material) => material.link },
		{ title: 'Action', key: 'operation', render: (material) => 
			<>
				<Link href={`/material/edit/${material.id}`}>
					<a>
						<div className="btn btn-success ">
							<div className="d-flex align-items-center justify-content-center">
								<FaPencilAlt color="white" className="mr-2" /> Edit
							</div>
						</div>
					</a>
				</Link>
				<div className="btn btn-danger" onClick={() => props.deleteTest(material.id)}>
					<div className="d-flex align-items-center justify-content-center">Delete</div>
				</div>
			</>
		},
	];

	const data = [];
	props.materials && props.materials.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			title: item.title,
			link: item.material,
		})
	})

	data.sort((x,y) =>  y.id - x.id)

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					//expandable={{ expandedRowRender }}
					dataSource={data}
					locale={{
						emptyText: 
							<Empty description={<span>No tests yet, create one from above</span>} />
					}}
				/>
			}
		</>
	);
}