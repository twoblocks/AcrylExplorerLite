import React from 'react';

import Loader from '../shared/Loader';
import ServiceFactory from '../services/ServiceFactory';

import Pagination from './Pagination';
import BlockList from './BlockList';

const BLOCKS_PER_PAGE = 20;

export default class BlocksPage extends React.Component {
    state = {
        height: 0,
        currentPage: 1,
        lastPage: 10,
        blocks: [],
        hasError: false
    };

    initialFetch = () => {
        return ServiceFactory.infoService().loadHeight().then(height => {
            const lastPage = Math.ceil(height / BLOCKS_PER_PAGE);

            this.setState({height, lastPage});

            return this.loadCurrentPage(1);
        })
    };

    loadCurrentPage = (pageNumber) => {
        const from = Math.max(1, this.state.height - pageNumber * BLOCKS_PER_PAGE + 1);
        const to = Math.min(this.state.height, from + BLOCKS_PER_PAGE);

        ServiceFactory.blockService().loadSequence(from, to).then(blocks => this.setState({blocks}));
    };

    handlePageChange = pageNumber => {
        this.loadCurrentPage(pageNumber);
    };

    render() {
        return (
            <Loader fetchData={this.initialFetch} errorTitle="Failed to load blocks">
                <React.Fragment>
                    <div className="headline">
                        <span className="title">Blocks</span>
                        <Pagination currentPage={this.state.currentPage} lastPage={this.state.lastPage}
                                    onPageChange={this.handlePageChange} />
                    </div>
                    <BlockList blocks={this.state.blocks} />
                </React.Fragment>
            </Loader>
        );
    }
}
