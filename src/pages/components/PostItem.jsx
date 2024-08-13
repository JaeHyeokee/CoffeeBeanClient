import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = (props) => {

    const { postId, type, title } = props.post;

    return (
        <tr>
            <td>
                <Link to={'/PostDetail/' + postId}>
                    {title}
                </Link>
            </td>
        </tr>
    );
};

export default PostItem;