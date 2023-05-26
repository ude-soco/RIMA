import React, { useState } from 'react';
import Select from 'react-select';

const YearRangePicker = ({ setFilters }) => {
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);

    const generateYearOptions = () => {
        const minYear = 1900;
        const maxYear = new Date().getFullYear();
        const options = [];

        for (let year = minYear; year <= maxYear; year++) {
            options.push({ value: year, label: year });
        }

        return options;
    };

    const yearOptions = generateYearOptions();

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 200, // set the desired width of the input field here
        }),
    };

    return (
        <div>
            <Select
                value={startYear}
                options={yearOptions}
                onChange={(value) => {
                    setFilters((filters) => ({ ...filters, startYear: value.value }));
                    setStartYear(value);
                }}
                placeholder="Start Year"
                styles={customStyles}
            />
            <Select
                value={endYear}
                options={yearOptions}
                onChange={(value) => {
                    setFilters((filters) => ({ ...filters, endYear: value.value }));
                    setEndYear(value);
                }}
                placeholder="End Year"
                styles={customStyles}
            />
        </div>
    );
};

export default YearRangePicker;
