import React from 'react';

import {
  Col,
  Row,
} from 'reactstrap';

import {useQuery} from '@apollo/react-hooks';
import {GET_APPLICATIONS} from './Queries';
import ApplicationsTable from './ApplicationsTable';

const Applications = props => {
    const loadingData = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    const { loading, error, data } = useQuery(GET_APPLICATIONS)
    
    if (loading) return loadingData();
    if (error) return (<p>{`Error ${error}`}</p>)
    
    return (
        <div className="animated fadeIn">
            <Row>
                <Col md="12">
                    <ApplicationsTable data={data.applications} />
                </Col>
            </Row>
        </div>
    )
}

export default Applications;