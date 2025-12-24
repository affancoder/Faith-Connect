import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../../types';
import { SettingsSection, SettingsHeader } from './components';

interface AccountDetailsScreenProps {
    onBack: () => void;
    user: User;
    onSave: (data: Partial<User>) => void;
}

const allCountryCodes = [
    { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
    { name: 'Albania', code: '+355', flag: '🇦🇱' },
    { name: 'Algeria', code: '+213', flag: '🇩🇿' },
    { name: 'American Samoa', code: '+1684', flag: '🇦🇸' },
    { name: 'Andorra', code: '+376', flag: '🇦🇩' },
    { name: 'Angola', code: '+244', flag: '🇦🇴' },
    { name: 'Anguilla', code: '+1264', flag: '🇦🇮' },
    { name: 'Antarctica', code: '+672', flag: '🇦🇶' },
    { name: 'Antigua and Barbuda', code: '+1268', flag: '🇦🇬' },
    { name: 'Argentina', code: '+54', flag: '🇦🇷' },
    { name: 'Armenia', code: '+374', flag: '🇦🇲' },
    { name: 'Aruba', code: '+297', flag: '🇦🇼' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Austria', code: '+43', flag: '🇦🇹' },
    { name: 'Azerbaijan', code: '+994', flag: '🇦🇿' },
    { name: 'Bahamas', code: '+1242', flag: '🇧🇸' },
    { name: 'Bahrain', code: '+973', flag: '🇧🇭' },
    { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
    { name: 'Barbados', code: '+1246', flag: '🇧🇧' },
    { name: 'Belarus', code: '+375', flag: '🇧🇾' },
    { name: 'Belgium', code: '+32', flag: '🇧🇪' },
    { name: 'Belize', code: '+501', flag: '🇧🇿' },
    { name: 'Benin', code: '+229', flag: '🇧🇯' },
    { name: 'Bermuda', code: '+1441', flag: '🇧🇲' },
    { name: 'Bhutan', code: '+975', flag: '🇧🇹' },
    { name: 'Bolivia', code: '+591', flag: '🇧🇴' },
    { name: 'Bosnia and Herzegovina', code: '+387', flag: '🇧🇦' },
    { name: 'Botswana', code: '+267', flag: '🇧🇼' },
    { name: 'Brazil', code: '+55', flag: '🇧🇷' },
    { name: 'British Indian Ocean Territory', code: '+246', flag: '🇮🇴' },
    { name: 'Brunei Darussalam', code: '+673', flag: '🇧🇳' },
    { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
    { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
    { name: 'Burundi', code: '+257', flag: '🇧🇮' },
    { name: 'Cambodia', code: '+855', flag: '🇰🇭' },
    { name: 'Cameroon', code: '+237', flag: '🇨🇲' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Cape Verde', code: '+238', flag: '🇨🇻' },
    { name: 'Cayman Islands', code: '+345', flag: '🇰🇾' },
    { name: 'Central African Republic', code: '+236', flag: '🇨🇫' },
    { name: 'Chad', code: '+235', flag: '🇹🇩' },
    { name: 'Chile', code: '+56', flag: '🇨🇱' },
    { name: 'China', code: '+86', flag: '🇨🇳' },
    { name: 'Christmas Island', code: '+61', flag: '🇨🇽' },
    { name: 'Cocos (Keeling) Islands', code: '+61', flag: '🇨🇨' },
    { name: 'Colombia', code: '+57', flag: '🇨🇴' },
    { name: 'Comoros', code: '+269', flag: '🇰🇲' },
    { name: 'Congo', code: '+242', flag: '🇨🇬' },
    { name: 'Cook Islands', code: '+682', flag: '🇨🇰' },
    { name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
    { name: 'Croatia', code: '+385', flag: '🇭🇷' },
    { name: 'Cuba', code: '+53', flag: '🇨🇺' },
    { name: 'Cyprus', code: '+537', flag: '🇨🇾' },
    { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
    { name: 'Denmark', code: '+45', flag: '🇩🇰' },
    { name: 'Djibouti', code: '+253', flag: '🇩🇯' },
    { name: 'Dominica', code: '+1767', flag: '🇩🇲' },
    { name: 'Dominican Republic', code: '+1849', flag: '🇩🇴' },
    { name: 'Ecuador', code: '+593', flag: '🇪🇨' },
    { name: 'Egypt', code: '+20', flag: '🇪🇬' },
    { name: 'El Salvador', code: '+503', flag: '🇸🇻' },
    { name: 'Equatorial Guinea', code: '+240', flag: '🇬🇶' },
    { name: 'Eritrea', code: '+291', flag: '🇪🇷' },
    { name: 'Estonia', code: '+372', flag: '🇪🇪' },
    { name: 'Ethiopia', code: '+251', flag: '🇪🇹' },
    { name: 'Falkland Islands (Malvinas)', code: '+500', flag: '🇫🇰' },
    { name: 'Faroe Islands', code: '+298', flag: '🇫🇴' },
    { name: 'Fiji', code: '+679', flag: '🇫🇯' },
    { name: 'Finland', code: '+358', flag: '🇫🇮' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'French Guiana', code: '+594', flag: '🇬🇫' },
    { name: 'French Polynesia', code: '+689', flag: '🇵🇫' },
    { name: 'Gabon', code: '+241', flag: '🇬🇦' },
    { name: 'Gambia', code: '+220', flag: '🇬🇲' },
    { name: 'Georgia', code: '+995', flag: '🇬🇪' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'Ghana', code: '+233', flag: '🇬🇭' },
    { name: 'Gibraltar', code: '+350', flag: '🇬🇮' },
    { name: 'Greece', code: '+30', flag: '🇬🇷' },
    { name: 'Greenland', code: '+299', flag: '🇬🇱' },
    { name: 'Grenada', code: '+1473', flag: '🇬🇩' },
    { name: 'Guadeloupe', code: '+590', flag: '🇬🇵' },
    { name: 'Guam', code: '+1671', flag: '🇬🇺' },
    { name: 'Guatemala', code: '+502', flag: '🇬🇹' },
    { name: 'Guernsey', code: '+44', flag: '🇬🇬' },
    { name: 'Guinea', code: '+224', flag: '🇬🇳' },
    { name: 'Guinea-Bissau', code: '+245', flag: '🇬🇼' },
    { name: 'Guyana', code: '+595', flag: '🇬🇾' },
    { name: 'Haiti', code: '+509', flag: '🇭🇹' },
    { name: 'Honduras', code: '+504', flag: '🇭🇳' },
    { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
    { name: 'Hungary', code: '+36', flag: '🇭🇺' },
    { name: 'Iceland', code: '+354', flag: '🇮🇸' },
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
    { name: 'Iran', code: '+98', flag: '🇮🇷' },
    { name: 'Iraq', code: '+964', flag: '🇮🇶' },
    { name: 'Ireland', code: '+353', flag: '🇮🇪' },
    { name: 'Isle of Man', code: '+44', flag: '🇮🇲' },
    { name: 'Israel', code: '+972', flag: '🇮🇱' },
    { name: 'Italy', code: '+39', flag: '🇮🇹' },
    { name: 'Jamaica', code: '+1876', flag: '🇯🇲' },
    { name: 'Japan', code: '+81', flag: '🇯🇵' },
    { name: 'Jersey', code: '+44', flag: '🇯🇪' },
    { name: 'Jordan', code: '+962', flag: '🇯🇴' },
    { name: 'Kazakhstan', code: '+77', flag: '🇰🇿' },
    { name: 'Kenya', code: '+254', flag: '🇰🇪' },
    { name: 'Kiribati', code: '+686', flag: '🇰🇮' },
    { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
    { name: 'Kyrgyzstan', code: '+996', flag: '🇰🇬' },
    { name: 'Lao People\'s Democratic Republic', code: '+856', flag: '🇱🇦' },
    { name: 'Latvia', code: '+371', flag: '🇱🇻' },
    { name: 'Lebanon', code: '+961', flag: '🇱🇧' },
    { name: 'Lesotho', code: '+266', flag: '🇱🇸' },
    { name: 'Liberia', code: '+231', flag: '🇱🇷' },
    { name: 'Libyan Arab Jamahiriya', code: '+218', flag: '🇱🇾' },
    { name: 'Liechtenstein', code: '+423', flag: '🇱🇮' },
    { name: 'Lithuania', code: '+370', flag: '🇱🇹' },
    { name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
    { name: 'Macao', code: '+853', flag: '🇲🇴' },
    { name: 'Madagascar', code: '+261', flag: '🇲🇬' },
    { name: 'Malawi', code: '+265', flag: '🇲🇼' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
    { name: 'Maldives', code: '+960', flag: '🇲🇻' },
    { name: 'Mali', code: '+223', flag: '🇲🇱' },
    { name: 'Malta', code: '+356', flag: '🇲🇹' },
    { name: 'Marshall Islands', code: '+692', flag: '🇲🇭' },
    { name: 'Martinique', code: '+596', flag: '🇲🇶' },
    { name: 'Mauritania', code: '+222', flag: '🇲🇷' },
    { name: 'Mauritius', code: '+230', flag: '🇲🇺' },
    { name: 'Mayotte', code: '+262', flag: '🇾🇹' },
    { name: 'Mexico', code: '+52', flag: '🇲🇽' },
    { name: 'Monaco', code: '+377', flag: '🇲🇨' },
    { name: 'Mongolia', code: '+976', flag: '🇲🇳' },
    { name: 'Montenegro', code: '+382', flag: '🇲🇪' },
    { name: 'Montserrat', code: '+1664', flag: '🇲🇸' },
    { name: 'Morocco', code: '+212', flag: '🇲🇦' },
    { name: 'Mozambique', code: '+258', flag: '🇲🇿' },
    { name: 'Myanmar', code: '+95', flag: '🇲🇲' },
    { name: 'Namibia', code: '+264', flag: '🇳🇦' },
    { name: 'Nauru', code: '+674', flag: '🇳🇷' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
    { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
    { name: 'New Caledonia', code: '+687', flag: '🇳🇨' },
    { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
    { name: 'Nicaragua', code: '+505', flag: '🇳🇮' },
    { name: 'Niger', code: '+227', flag: '🇳🇪' },
    { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
    { name: 'Niue', code: '+683', flag: '🇳🇺' },
    { name: 'Norfolk Island', code: '+672', flag: '🇳🇫' },
    { name: 'North Korea', code: '+850', flag: '🇰🇵' },
    { name: 'Northern Mariana Islands', code: '+1670', flag: '🇲🇵' },
    { name: 'Norway', code: '+47', flag: '🇳🇴' },
    { name: 'Oman', code: '+968', flag: '🇴🇲' },
    { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
    { name: 'Palau', code: '+680', flag: '🇵🇼' },
    { name: 'Panama', code: '+507', flag: '🇵🇦' },
    { name: 'Papua New Guinea', code: '+675', flag: '🇵🇬' },
    { name: 'Paraguay', code: '+595', flag: '🇵🇾' },
    { name: 'Peru', code: '+51', flag: '🇵🇪' },
    { name: 'Philippines', code: '+63', flag: '🇵🇭' },
    { name: 'Poland', code: '+48', flag: '🇵🇱' },
    { name: 'Portugal', code: '+351', flag: '🇵🇹' },
    { name: 'Puerto Rico', code: '+1939', flag: '🇵🇷' },
    { name: 'Qatar', code: '+974', flag: '🇶🇦' },
    { name: 'Romania', code: '+40', flag: '🇷🇴' },
    { name: 'Russia', code: '+7', flag: '🇷🇺' },
    { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
    { name: 'Samoa', code: '+685', flag: '🇼🇸' },
    { name: 'San Marino', code: '+378', flag: '🇸🇲' },
    { name: 'Sao Tome and Principe', code: '+239', flag: '🇸🇹' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
    { name: 'Senegal', code: '+221', flag: '🇸🇳' },
    { name: 'Serbia', code: '+381', flag: '🇷🇸' },
    { name: 'Seychelles', code: '+248', flag: '🇸🇨' },
    { name: 'Sierra Leone', code: '+232', flag: '🇸🇱' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Slovakia', code: '+421', flag: '🇸🇰' },
    { name: 'Slovenia', code: '+386', flag: '🇸🇮' },
    { name: 'Solomon Islands', code: '+677', flag: '🇸🇧' },
    { name: 'Somalia', code: '+252', flag: '🇸🇴' },
    { name: 'South Africa', code: '+27', flag: '🇿🇦' },
    { name: 'South Korea', code: '+82', flag: '🇰🇷' },
    { name: 'Spain', code: '+34', flag: '🇪🇸' },
    { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
    { name: 'Sudan', code: '+249', flag: '🇸🇩' },
    { name: 'Suriname', code: '+597', flag: '🇸🇷' },
    { name: 'Sweden', code: '+46', flag: '🇸🇪' },
    { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
    { name: 'Syrian Arab Republic', code: '+963', flag: '🇸🇾' },
    { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
    { name: 'Tajikistan', code: '+992', flag: '🇹🇯' },
    { name: 'Tanzania', code: '+255', flag: '🇹🇿' },
    { name: 'Thailand', code: '+66', flag: '🇹🇭' },
    { name: 'Timor-Leste', code: '+670', flag: '🇹🇱' },
    { name: 'Togo', code: '+228', flag: '🇹🇬' },
    { name: 'Tokelau', code: '+690', flag: '🇹🇰' },
    { name: 'Tonga', code: '+676', flag: '🇹🇴' },
    { name: 'Trinidad and Tobago', code: '+1868', flag: '🇹🇹' },
    { name: 'Tunisia', code: '+216', flag: '🇹🇳' },
    { name: 'Turkey', code: '+90', flag: '🇹🇷' },
    { name: 'Turkmenistan', code: '+993', flag: '🇹🇲' },
    { name: 'Turks and Caicos Islands', code: '+1649', flag: '🇹🇨' },
    { name: 'Tuvalu', code: '+688', flag: '🇹🇻' },
    { name: 'Uganda', code: '+256', flag: '🇺🇬' },
    { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'Uruguay', code: '+598', flag: '🇺🇾' },
    { name: 'Uzbekistan', code: '+998', flag: '🇺🇿' },
    { name: 'Vanuatu', code: '+678', flag: '🇻🇺' },
    { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
    { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
    { name: 'Virgin Islands, British', code: '+1284', flag: '🇻🇬' },
    { name: 'Virgin Islands, U.S.', code: '+1340', flag: '🇻🇮' },
    { name: 'Wallis and Futuna', code: '+681', flag: '🇼🇫' },
    { name: 'Yemen', code: '+967', flag: '🇾🇪' },
    { name: 'Zambia', code: '+260', flag: '🇿🇲' },
    { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' },
];

const us = allCountryCodes.find(c => c.code === '+1' && c.name === 'United States');
const defaultCountry = us || allCountryCodes[0];

type Country = typeof allCountryCodes[0];

interface CountryCodePickerProps {
    onSelect: (country: Country) => void;
    onClose: () => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCountries = useMemo(() => {
        if (!searchTerm) return allCountryCodes;
        const lowercasedTerm = searchTerm.toLowerCase();
        return allCountryCodes.filter(
            country =>
                country.name.toLowerCase().includes(lowercasedTerm) ||
                country.code.includes(lowercasedTerm)
        );
    }, [searchTerm]);

    return (
         <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col">
            <SettingsHeader title="Select Country" onBack={onClose} />
             <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search for a country"
                    className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                    autoFocus
                />
            </div>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCountries.map(country => (
                        <button
                            key={country.name}
                            onClick={() => onSelect(country)}
                            className="w-full flex items-center space-x-4 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="text-2xl">{country.flag}</span>
                            <span className="flex-grow font-medium text-slate-800 dark:text-slate-200">{country.name}</span>
                            <span className="text-slate-500 dark:text-slate-400">{country.code}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};


const EditableItem: React.FC<{ label: string, value: string, onChange: (value: string) => void, type?: string, placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div className="flex items-center justify-between p-3.5">
        <label className="font-medium text-slate-800 dark:text-slate-200 text-base flex-shrink-0">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-auto bg-transparent text-right text-slate-600 dark:text-slate-400 focus:outline-none text-base"
        />
    </div>
);

const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({ onBack, user, onSave }) => {
    const [email, setEmail] = useState(user.email || '');
    const [birthday, setBirthday] = useState(user.birthday || '');
    const [isCodePickerOpen, setIsCodePickerOpen] = useState(false);
    
    const parsePhoneNumber = (fullNumber?: string): { country: Country, number: string } => {
        if (!fullNumber) return { country: defaultCountry, number: '' };

        const matchingCountry = allCountryCodes
            .slice()
            .sort((a, b) => b.code.length - a.code.length)
            .find(c => fullNumber.startsWith(c.code));

        if (matchingCountry) {
            const numberPart = fullNumber.substring(matchingCountry.code.length).replace(/^-/, '');
            return { country: matchingCountry, number: numberPart };
        }
        
        return { country: defaultCountry, number: fullNumber };
    };

    const initialPhone = parsePhoneNumber(user.phone);
    const [selectedCountry, setSelectedCountry] = useState<Country>(initialPhone.country);
    const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);

    const newFullPhone = `${selectedCountry.code}-${phoneNumber}`;
    const hasChanges = email !== (user.email || '') || newFullPhone !== (user.phone || '') || birthday !== (user.birthday || '');

    const handleSave = () => {
        if (!hasChanges) return;
        onSave({ email, phone: newFullPhone, birthday });
        onBack();
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[55] flex flex-col">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onBack} className="text-brand-blue font-medium text-base">Back</button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Account Details</h1>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`font-bold text-base ${!hasChanges ? 'text-slate-400 dark:text-slate-600' : 'text-brand-blue'}`}
                    >
                        Save
                    </button>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Personal Information">
                        <EditableItem label="Email" value={email} onChange={setEmail} type="email" placeholder="Add email" />
                        <div className="flex items-center justify-between p-3.5">
                            <label className="font-medium text-slate-800 dark:text-slate-200 text-base flex-shrink-0">Phone</label>
                            <div className="flex items-stretch rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-transparent overflow-hidden max-w-[70%]">
                                <button
                                    onClick={() => setIsCodePickerOpen(true)}
                                    className="flex items-center space-x-2 pl-3 pr-2 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <span className="text-lg">{selectedCountry.flag}</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedCountry.code}</span>
                                </button>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    placeholder="Phone number"
                                    className="flex-grow bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none text-base px-3 w-full"
                                />
                            </div>
                        </div>
                        <EditableItem label="Birthday" value={birthday} onChange={setBirthday} type="date" />
                    </SettingsSection>
                </div>
            </main>
            {isCodePickerOpen && (
                <CountryCodePicker
                    onClose={() => setIsCodePickerOpen(false)}
                    onSelect={(country) => {
                        setSelectedCountry(country);
                        setIsCodePickerOpen(false);
                    }}
                />
            )}
        </div>
    );
};


export default AccountDetailsScreen;
