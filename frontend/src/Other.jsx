import { NavLink } from 'react-router-dom';

function Other() {
    return (
        <>
            <p>This is the other page. Congratulations, you made it.</p>
            <NavLink to="/">Link to Home</NavLink>
        </>
    );
}

export default Other;
