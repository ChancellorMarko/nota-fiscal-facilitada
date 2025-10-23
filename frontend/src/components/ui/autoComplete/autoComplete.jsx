// src/components/Autocomplete/Autocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';
import loadIcon from '../svg/load.svg';
import './autoCompleteStyle.css';

function Autocomplete({
    value,
    onChange,
    onSelect,
    searchFunction,
    placeholder,
    displayKey = 'nome',
    secondaryKey = 'cnpj',
    minChars = 2,
    debounceMs = 300,
    ...inputProps
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const timeoutRef = useRef(null);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Busca sugestões com debounce
    useEffect(() => {
        if (value && value.length >= minChars) {
            // Limpa timeout anterior
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Cria novo timeout
            timeoutRef.current = setTimeout(async () => {
                setIsLoading(true);
                try {
                    const results = await searchFunction(value);
                    setSuggestions(results);
                    setIsOpen(results.length > 0);
                } catch (error) {
                    console.error('Erro ao buscar sugestões:', error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            }, debounceMs);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, searchFunction, minChars, debounceMs]);

    const handleInputChange = (e) => {
        onChange(e);
        setSelectedIndex(-1);
    };

    const handleSelect = (suggestion) => {
        onSelect(suggestion);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={index}>{part}</mark>
                : part
        );
    };

    return (
        <div className="autocomplete-wrapper" ref={wrapperRef}>
            <div className="autocomplete-input-wrapper">
                <input
                    {...inputProps}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`form-input ${inputProps.className || ''}`}
                    autoComplete="off"
                />
                {isLoading && (
                    <div className="autocomplete-loading">
                        <img className='spinner-circle' src={loadIcon} alt="Loading" />
                    </div>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`autocomplete-item ${index === selectedIndex ? 'autocomplete-item-selected' : ''}`}
                            onClick={() => handleSelect(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="autocomplete-item-main">
                                {highlightMatch(suggestion[displayKey], value)}
                            </div>
                            {secondaryKey && suggestion[secondaryKey] && (
                                <div className="autocomplete-item-secondary">
                                    {suggestion[secondaryKey]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && suggestions.length === 0 && !isLoading && value.length >= minChars && (
                <div className="autocomplete-dropdown">
                    <div className="autocomplete-empty">
                        Nenhum resultado encontrado
                    </div>
                </div>
            )}
        </div>
    );
}

export default Autocomplete;