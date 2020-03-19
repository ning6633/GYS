import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';


class CustomScroll extends Component {
    render() {
        let { children } = this.props;
        return (
            <div>
                <Scrollbars
                    autoHeight
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    style={{ width: '100%' }}
                    autoHeightMin={100}
                    autoHeightMax={400}>
                    {
                        children
                    }
                    <p></p>
                </Scrollbars>
            </div>
        )
    }
}

CustomScroll.propTypes = {
}
export default CustomScroll;