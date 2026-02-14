import React from 'react';
import './styles/Sidebar.css';
import { Link, NavLink } from 'react-router-dom';

export const Sidebar = () => {
    return (
        <aside className='sidebar'>
            <header>
                <h1><Link to="/">Smasher</Link></h1>
            </header>
            <hr />
            <nav className="navigation">
                <ul className='nav-list'>
                    <li>
                        <NavLink to="/tournaments" className={({ isActive }) => isActive ? 'active' : ''}>
                            Tournaments
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/player" className={({ isActive }) => isActive ? 'active' : ''}>
                            Player
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/performance" className={({ isActive }) => isActive ? 'active' : ''}>
                            Performance
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>   
    )
}