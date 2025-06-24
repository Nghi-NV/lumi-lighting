import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { SAMPLE_PROJECT, PROJECT_STORAGE_KEY } from '../constants';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const navigate = useNavigate();

  const loadProjects = useCallback(() => {
    setIsLoading(true);
    try {
      const storedProjectsJSON = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (storedProjectsJSON) {
        const parsedProjects: Project[] = JSON.parse(storedProjectsJSON);
        // Sort projects by creation date, newest first
        parsedProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProjects(parsedProjects);
      } else {
        // If no projects, initialize with the sample project
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify([SAMPLE_PROJECT]));
        setProjects([SAMPLE_PROJECT]);
      }
    } catch (error) {
      console.error("Error loading or parsing projects from localStorage:", error);
      // Fallback to sample project if parsing fails or data is corrupt
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify([SAMPLE_PROJECT]));
      setProjects([SAMPLE_PROJECT]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDeleteRequest = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      try {
        const updatedProjects = projects.filter(p => p.id !== projectToDelete.id);
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setProjectToDelete(null);
      } catch (error) {
         console.error("Error deleting project from localStorage:", error);
         alert("Lỗi khi xóa dự án. Vui lòng thử lại.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Đang tải danh sách dự án...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dự án của tôi</h1>
        <Button onClick={() => navigate('/new-project')} variant="primary">
          <i className="fas fa-plus mr-2"></i> Tạo dự án mới
        </Button>
      </header>

      {projects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Không có dự án nào</h2>
            <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo một dự án chiếu sáng mới của bạn.</p>
            <Button onClick={() => navigate('/new-project')} variant="primary" size="lg">
              Tạo dự án đầu tiên
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={project.projectName}>
                  {project.projectName}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-home mr-2 text-gray-400"></i>
                  {project.spaceInfo.projectType} - {project.spaceInfo.roomType}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                  Ngày tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2 border-t pt-4">
                <Button
                  onClick={() => handleDeleteRequest(project)}
                  variant="danger"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <i className="fas fa-trash-alt mr-1"></i> Xóa
                </Button>
                <Link to={`/design/${project.id}`} className="w-full sm:w-auto">
                  <Button variant="primary" size="sm" className="w-full">
                    <i className="fas fa-pencil-ruler mr-1"></i> Xem Thiết kế
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Xác nhận Xóa Dự án"
        size="sm"
      >
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa dự án "{projectToDelete?.projectName}" không? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setProjectToDelete(null)}>Hủy bỏ</Button>
          <Button variant="danger" onClick={confirmDelete}>Xác nhận Xóa</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsListPage;