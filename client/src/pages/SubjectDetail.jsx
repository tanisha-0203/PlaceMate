<<<<<<< HEAD
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { csSubjectsData } from '../data/csSubjects';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronRight, FileText, Link as LinkIcon, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
=======
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { csSubjectsData } from '../data/csSubjects';
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, CheckSquare, FileText, Link as LinkIcon, Plus, Square } from 'lucide-react';
import { cn } from '../utils/cn';
import subjectService from '../services/subjectService';
import noteService from '../services/noteService';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';

const statusStyles = {
  notStarted: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  inProgress: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
};

const statusLabels = {
  notStarted: 'Not Started',
  inProgress: 'In Progress',
  completed: 'Completed',
};
>>>>>>> c76f504 (updating changes)

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = csSubjectsData[subjectId];

<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('topics'); // 'topics', 'notes', 'resources'
  const [expandedTopic, setExpandedTopic] = useState(null);
=======
  const [activeTab, setActiveTab] = useState('topics');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subjectProgress, setSubjectProgress] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [updatingTopic, setUpdatingTopic] = useState(null);

  const backendName = subject?.title;
  const isTrackable = Boolean(subject);

  useEffect(() => {
    if (!subject) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const subjects = await subjectService.getSubjects();
        const progressDoc = subjects.find((item) => item.subject === backendName);
        setSubjectProgress(progressDoc || null);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load subject tracker data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNotes = async () => {
      setNotesLoading(true);
      try {
        const noteList = await noteService.getNotes({ subject: subject.title });
        setNotes(noteList);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load notes for this subject.');
      } finally {
        setNotesLoading(false);
      }
    };

    fetchProgress();
    fetchNotes();
  }, [subject, backendName]);

  const initializeTracker = async () => {
    if (!subject || !backendName) return null;
    setInitializing(true);
    try {
      const payload = {
        subject: backendName,
        topics: subject.topics.map((topic) => ({
          name: topic.title,
          status: 'notStarted',
          confidence: 'low',
          notes: '',
        })),
      };

      const created = await subjectService.upsertSubject(payload);
      setSubjectProgress(created);
      toast.success(`${subject.title} tracker created.`);
      return created;
    } catch (error) {
      console.error(error);
      toast.error('Unable to create tracker for this subject.');
      return null;
    } finally {
      setInitializing(false);
    }
  };

  const toggleTopicCompletion = async (topic, index) => {
    setUpdatingTopic(topic.id);
    try {
      let tracker = subjectProgress;
      if (!tracker) {
        tracker = await initializeTracker();
        if (!tracker) throw new Error('Tracker initialization failed');
      }

      const topicId = topic._id || tracker.topics[index]?._id || tracker.topics.find((item) => item.name === topic.name)?._id;
      if (!topicId) throw new Error('Topic ID not found');

      const newStatus = topic.status === 'completed' ? 'notStarted' : 'completed';
      const updated = await subjectService.updateTopic(tracker._id, {
        topicId,
        status: newStatus,
      });
      setSubjectProgress(updated);
      toast.success(`Marked "${topic.name}" as ${newStatus === 'completed' ? 'completed' : 'not started'}.`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update topic status.');
    } finally {
      setUpdatingTopic(null);
    }
  };

  const [checkedSubtopics, setCheckedSubtopics] = useState({});

  const isSubtopicChecked = (topic, topicIndex, subIndex) => {
    const topicId = topic._id || topic.id || `${subjectId}-${topicIndex}`;
    const checked = checkedSubtopics[topicId];
    if (checked && checked.length) {
      return checked.includes(subIndex);
    }
    return topic.status === 'completed';
  };

  const toggleSubtopicCompletion = async (topic, topicIndex, subIndex) => {
    const topicId = topic._id || topic.id || `${subjectId}-${topicIndex}`;
    const current = checkedSubtopics[topicId] ?? (topic.status === 'completed' ? topic.subtopics.map((_, i) => i) : []);
    const isChecked = current.includes(subIndex);
    const nextChecked = isChecked ? current.filter((i) => i !== subIndex) : [...current, subIndex];

    setCheckedSubtopics((prev) => ({
      ...prev,
      [topicId]: nextChecked,
    }));

    if (topic.subtopics && topic.subtopics.length > 0) {
      if (nextChecked.length === topic.subtopics.length && topic.status !== 'completed') {
        await toggleTopicCompletion(topic, topicIndex);
      } else if (nextChecked.length < topic.subtopics.length && topic.status === 'completed') {
        await toggleTopicCompletion(topic, topicIndex);
      }
    }
  };

  const topicRows = useMemo(() => {
    if (!subject) return [];

    if (subjectProgress?.topics?.length) {
      return subjectProgress.topics.map((topic, index) => ({
        ...topic,
        importance: subject.topics[index]?.importance || 'Medium',
        subtopics: subject.topics[index]?.subtopics || [],
        id: topic._id || `${subjectId}-${index}`,
      }));
    }

    return subject.topics.map((topic) => ({
      id: topic.id,
      name: topic.title,
      status: 'notStarted',
      importance: topic.importance,
      subtopics: topic.subtopics,
    }));
  }, [subject, subjectProgress, subjectId]);
>>>>>>> c76f504 (updating changes)

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject Not Found</h2>
        <button onClick={() => navigate('/subjects')} className="text-indigo-600 hover:underline">
          Return to Subjects
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  const toggleTopic = (id) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
=======
  const noteCount = notes.length;
  const totalTopics = subjectProgress?.topics?.length ?? subject?.topics.length ?? 0;
  const completedTopics = subjectProgress
    ? subjectProgress.topics.filter((topic) => topic.status === 'completed').length
    : 0;
  const subjectStatus = subjectProgress
    ? completedTopics === totalTopics && totalTopics > 0
      ? 'Completed'
      : completedTopics > 0
      ? 'In Progress'
      : 'Not Started'
    : 'Not Started';

  return (
    <div className="max-w-6xl mx-auto pb-12">
>>>>>>> c76f504 (updating changes)
      <div className="mb-8">
        <Link to="/subjects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Subjects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              {subject.title}
            </h1>
<<<<<<< HEAD
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              {subject.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
=======
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">{subject.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              {subjectStatus}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isTrackable && !subjectProgress && (
              <button
                onClick={initializeTracker}
                disabled={initializing}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all disabled:opacity-60"
              >
                <Plus className="h-4 w-4 mr-2" />
                {initializing ? 'Creating tracker...' : 'Start Tracker'}
              </button>
            )}
            <button
              onClick={() => navigate(`/notes?subject=${encodeURIComponent(subject.title)}`)}
              className="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Notes {noteCount ? `(${noteCount})` : ''}
>>>>>>> c76f504 (updating changes)
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Tabs */}
=======
>>>>>>> c76f504 (updating changes)
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto hide-scrollbar">
        {['topics', 'notes', 'resources'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
<<<<<<< HEAD
              "px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
=======
              'px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
>>>>>>> c76f504 (updating changes)
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

<<<<<<< HEAD
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* TOPICS TAB */}
=======
      <div className="min-h-[400px]">
>>>>>>> c76f504 (updating changes)
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden text-sm">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80">
                <div className="col-span-6 md:col-span-7">Topic</div>
                <div className="col-span-3 md:col-span-2 text-center">Importance</div>
                <div className="col-span-3 text-center">Status</div>
              </div>
<<<<<<< HEAD
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {subject.topics.map((topic) => (
                  <div key={topic.id} className="group">
                    <div 
                      onClick={() => toggleTopic(topic.id)}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="col-span-6 md:col-span-7 flex items-center font-semibold text-gray-900 dark:text-gray-100">
                        <button className="mr-3 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors">
                          {expandedTopic === topic.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                        {topic.title}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-center">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          topic.importance === "Critical" ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                          topic.importance === "High" ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20" :
                          "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                        )}>
                          {topic.importance}
                        </span>
                      </div>
                      <div className="col-span-3 text-center flex justify-center">
                        <button className="flex items-center justify-center h-8 px-3 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors text-xs font-semibold">
                          Pending
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Subtopics */}
                    {expandedTopic === topic.id && (
                      <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 pl-14 border-t border-gray-50 dark:border-gray-800/50 text-sm text-gray-600 dark:text-gray-300">
                        <ul className="space-y-3">
                          {topic.subtopics.map((sub, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-indigo-500 cursor-pointer">
                                {/* Check icon goes here when true */}
                              </div>
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full bg-white dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Notes Yet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
                You haven't added any notes for {subject.title}. Keep all your quick revision formulas, definitions, and snippets organized right here.
              </p>
              <button className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all">
                Create First Note
              </button>
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.resources.map(res => (
              <a 
                href={res.url}
                target="_blank"
                rel="noreferrer"
                key={res.id} 
                className="group flex items-start gap-4 bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                  {res.type === 'video' ? <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> : 
                   res.type === 'pdf' ? <FileText className="h-6 w-6 text-red-500" /> :
                   <LinkIcon className="h-6 w-6 text-blue-500" />}
=======

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <div className="p-8 flex justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  topicRows.map((topic, index) => (
                    <div key={topic.id} className="group">
                      <div
                        onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <div className="col-span-6 md:col-span-7 flex items-center font-semibold text-gray-900 dark:text-gray-100">
                          <button className="mr-3 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors">
                            {expandedTopic === topic.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                          </button>
                          {topic.name || topic.title}
                        </div>
                        <div className="col-span-3 md:col-span-2 text-center">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            topic.importance === 'Critical'
                              ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                              : topic.importance === 'High'
                              ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                              : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                          )}>
                            {topic.importance}
                          </span>
                        </div>
                        <div className="col-span-3 text-center flex justify-center items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleTopicCompletion(topic, index);
                            }}
                            disabled={updatingTopic === topic.id}
                            className={cn(
                              'inline-flex items-center justify-center h-8 w-8 rounded-md border transition-colors',
                              topic.status === 'completed'
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                            )}
                          >
                            {topic.status === 'completed' ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                          <span className={cn('inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-semibold', statusStyles[topic.status] || statusStyles.notStarted)}>
                            {statusLabels[topic.status] || statusLabels.notStarted}
                          </span>
                        </div>
                      </div>

                      {expandedTopic === topic.id && (
                        <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 pl-14 border-t border-gray-50 dark:border-gray-800/50 text-sm text-gray-600 dark:text-gray-300">
                          <ul className="space-y-3">
                            {topic.subtopics.map((sub, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleSubtopicCompletion(topic, index, idx)}
                                  className={cn(
                                    'h-4 w-4 rounded border flex items-center justify-center transition-colors',
                                    isSubtopicChecked(topic, index, idx)
                                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                      : 'border-gray-400 bg-transparent text-transparent hover:border-indigo-400'
                                  )}
                                >
                                  {isSubtopicChecked(topic, index, idx) ? <CheckSquare className="h-3.5 w-3.5" /> : null}
                                </button>
                                <span className={cn(
                                  'text-sm',
                                  isSubtopicChecked(topic, index, idx)
                                    ? 'text-gray-400 line-through dark:text-gray-500'
                                    : 'text-gray-900 dark:text-gray-100'
                                )}
                                >
                                  {sub}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            {notesLoading ? (
              <div className="rounded-3xl bg-white dark:bg-gray-900/50 p-8 flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : notes.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note) => (
                  <article key={note._id} className="bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{note.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{note.content || 'No content available.'}</p>
                      </div>
                      {note.isPinned && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">{note.subject || subject.title}</span>
                      {note.tags?.map((tag) => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">#{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="col-span-full bg-white dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Notes for {subject.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
                  This subject has no saved revision notes yet. Use the Notes page to create one and keep everything organized by subject.
                </p>
                <button
                  onClick={() => navigate(`/notes?subject=${encodeURIComponent(subject.title)}`)}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                >
                  Create Note for {subject.title}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.resources.map((res) => (
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                key={res.id}
                className="group flex items-start gap-4 bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                  {res.type === 'video' ? (
                    <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  ) : res.type === 'pdf' ? (
                    <FileText className="h-6 w-6 text-red-500" />
                  ) : (
                    <LinkIcon className="h-6 w-6 text-blue-500" />
                  )}
>>>>>>> c76f504 (updating changes)
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {res.title}
                  </h4>
<<<<<<< HEAD
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {res.type} Resource
                  </p>
                </div>
              </a>
            ))}
            
            {/* Add Custom Resource Card */}
=======
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{res.type} Resource</p>
                </div>
              </a>
            ))}

>>>>>>> c76f504 (updating changes)
            <button className="flex flex-col items-center justify-center h-[104px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
              <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Plus className="h-5 w-5 mr-2" /> Add Custom Resource
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
