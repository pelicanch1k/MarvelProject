import { Link, NavLink } from 'react-router-dom';

import './appHeader.scss';

const AppHeader = () => {
    const style = ({isActive}) => {
        return {
            "color": isActive ? "#9f0013" : "inherit"
        }
    }

    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink 
                    end 
                    style={style} to="/">Characters</NavLink></li>
                    /
                    <li><NavLink
                    end
                    style={style} to="/comics">Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;