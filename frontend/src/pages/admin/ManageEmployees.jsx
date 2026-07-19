import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, UserPlus, Search, Building2, Trash2 } from 'lucide-react';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'EMPLOYEE'
  });
  const [onboardLoading, setOnboardLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await adminService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setOnboardLoading(true);
    try {
      await adminService.onboardDriver(onboardForm);
      setShowOnboardModal(false);
      fetchEmployees();
      setOnboardForm({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', role: 'EMPLOYEE' });
    } catch (error) {
      console.error('Failed to onboard employee:', error);
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await adminService.deleteEmployee(id);
      fetchEmployees();
    } catch (error) {
      alert("Failed to delete employee.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminService.updateEmployeeRole(id, newRole);
      fetchEmployees();
    } catch (error) {
      alert("Failed to update role.");
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Employees</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage all registered employees</p>
        </div>
        <button 
          onClick={() => setShowOnboardModal(true)}
          className="btn-primary flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Onboard Employee
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Employee Name</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Contact Info</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Role</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600">Company</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#171a20] rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-slate-900">{emp.email}</div>
                      <div className="text-xs text-slate-500">{emp.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select 
                        value={emp.role} 
                        onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                        className={`text-xs font-semibold rounded-md px-2 py-1 outline-none appearance-none cursor-pointer ${emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Building2 className="w-4 h-4 mr-1.5 text-slate-400" />
                        {emp.companyName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Onboard New Employee</h2>
            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input type="text" required className="input-field py-2" value={onboardForm.firstName} onChange={e => setOnboardForm({...onboardForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input type="text" required className="input-field py-2" value={onboardForm.lastName} onChange={e => setOnboardForm({...onboardForm, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" required className="input-field py-2" value={onboardForm.email} onChange={e => setOnboardForm({...onboardForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" required className="input-field py-2" value={onboardForm.phoneNumber} onChange={e => setOnboardForm({...onboardForm, phoneNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
                <input type="password" required minLength={6} className="input-field py-2" value={onboardForm.password} onChange={e => setOnboardForm({...onboardForm, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select className="input-field py-2" value={onboardForm.role} onChange={e => setOnboardForm({...onboardForm, role: e.target.value})}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowOnboardModal(false)} className="flex-1 btn-secondary py-2">Cancel</button>
                <button type="submit" disabled={onboardLoading} className="flex-1 btn-primary py-2 flex justify-center items-center">
                  {onboardLoading ? 'Saving...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
