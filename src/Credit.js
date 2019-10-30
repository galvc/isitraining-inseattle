import React from "react";
//this function will take a prop of object user
//it will take the user's name and url
//user.username and user.links.html
//then it will return a div (with style later on) containing the name with links
function Credit(props) {
    const { url, username } = props.getUser;
    return (
        <span>
            Photo by <a href={url}>{username}</a> on{" "}
            <a
                href="https://unsplash.com/?utm_source=is_it_raining_in_seattle&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
            >
                Unsplash
            </a>
        </span>
    );
}

export default Credit;
