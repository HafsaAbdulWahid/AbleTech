import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  Textarea,
  IconButton,
  Badge,
  Divider,
  Flex,
  Image,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Tag,
  Tooltip,
  AvatarBadge,
} from '@chakra-ui/react';
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiSend,
  FiImage,
  FiX,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiAward,
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';
import axios from 'axios';

// ⚠️ IMPORTANT: Backend port 3001 pe hai
const API_BASE_URL = 'http://localhost:3001/api';

interface Comment {
  _id?: string;
  id?: number;
  author: string;
  authorId?: string;
  content: string;
  timestamp: string;
  createdAt?: string;
}

interface Post {
  _id?: string;
  id?: number;
  author: string;
  authorId?: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
  likes: number;
  likedBy?: string[];
  comments: Comment[];
  isLiked?: boolean;
  badge?: string;
  image?: string;
  category?: string;
}

// Dummy posts data
const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    author: 'Ayesha Khan',
    authorId: 'ayesha_khan_123',
    content: 'Hi everyone! Main visually impaired hoon aur honestly job search hamesha mushkil rahi hai. AbleTech ka AI-based job matching feature kaafi promising lag raha hai. Kisi ne yahan se remote job successfully get ki hai? Would love to hear your experience and tips.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likes: 24,
    likedBy: ['user456', 'user789'],
    comments: [
      {
        id: 101,
        author: 'Muhammad Hassan',
        authorId: 'hassan_m',
        content: 'Ayesha! I got a remote content writing job through AbleTech last month. The AI matching really works - focus on filling your profile completely!',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        author: 'Zainab Ali',
        authorId: 'zainab_ali',
        content: 'Same here! Got matched with a customer support role. Make sure to add your skills and preferences clearly.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      }
    ],
    badge: 'New Member',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    author: 'Umer Fayyaz',
    authorId: 'umer_fayyaz_456',
    content: 'I just want to appreciate AbleTech for focusing on real accessibility, not just job listings. As someone with physical mobility impairment, on-site jobs are hard, lekin yahan remote aur flexible options clearly mention hoti hain. Hope more employers join this platform! 🙌',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    likes: 42,
    likedBy: ['user123', 'user456', 'user789', 'ayesha_khan_123'],
    comments: [
      {
        id: 201,
        author: 'Sara Fawad',
        authorId: 'sara_fawad',
        content: 'Absolutely! As an HR professional, I can say this platform is a game-changer for inclusive hiring.',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      }
    ],
    badge: 'Active Member',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    author: 'Ali Sheikh',
    authorId: 'ali_sheikh_789',
    content: 'Salam everyone! AbleTech ke training programs aur skill-building sessions ke baare me poochna tha. Has anyone completed any course here? Are they beginner-friendly? I want to upskill before applying for jobs.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    likes: 18,
    likedBy: ['user123', 'ayesha_khan_123'],
    comments: [
      {
        id: 301,
        author: 'Fatima Noor',
        authorId: 'fatima_noor',
        content: 'I completed the "Digital Marketing Basics" course last week. Super beginner-friendly with Urdu subtitles option!',
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 302,
        author: 'Ahmed Raza',
        authorId: 'ahmed_raza',
        content: 'The Web Development course is excellent. They have screen reader support and clear step-by-step instructions.',
        createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
      }
    ],
    badge: 'New Member',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    author: 'Sara Fawad',
    authorId: 'sara_fawad_012',
    content: 'Hi community! I\'m an HR professional and recently joined AbleTech to hire inclusively. The way this platform highlights skills + accommodation needs is impressive. Looking forward to connecting with talented individuals here! 💼✨',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    likes: 56,
    likedBy: ['user123', 'user456', 'user789', 'ayesha_khan_123', 'umer_fayyaz_456', 'ali_sheikh_789'],
    comments: [
      {
        id: 401,
        author: 'Bilal Tariq',
        authorId: 'bilal_tariq',
        content: 'This is amazing! We need more HR professionals like you who understand inclusive hiring.',
        createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 402,
        author: 'Ayesha Khan',
        authorId: 'ayesha_khan_123',
        content: 'Welcome Sara! So glad to see employers actively looking to hire from this platform. 🙏',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 403,
        author: 'Hamza Malik',
        authorId: 'hamza_malik',
        content: 'Thank you for being part of the change! Looking forward to opportunities.',
        createdAt: new Date(Date.now() - 9.5 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 9.5 * 60 * 60 * 1000).toISOString(),
      }
    ],
    badge: 'HR Partner',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    author: 'Hina Aziz',
    authorId: 'hina_aziz_345',
    content: 'Just had my first successful interview through AbleTech! 🎉 The employer was already aware of my hearing impairment and had arranged a sign language interpreter. This is the kind of preparation and inclusivity we need. Fingers crossed for the final round! Thank you AbleTech team for making this possible.',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    likes: 67,
    likedBy: ['user123', 'user456', 'user789', 'ayesha_khan_123', 'umer_fayyaz_456', 'ali_sheikh_789', 'sara_fawad_012'],
    comments: [
      {
        id: 501,
        author: 'Umer Fayyaz',
        authorId: 'umer_fayyaz_456',
        content: 'This is wonderful news Hina! Best of luck for your final round! 🍀',
        createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 502,
        author: 'Ali Sheikh',
        authorId: 'ali_sheikh_789',
        content: 'MashaAllah! This gives me so much hope. Congratulations!',
        createdAt: new Date(Date.now() - 16.5 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 16.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 503,
        author: 'Sara Fawad',
        authorId: 'sara_fawad_012',
        content: 'Love to see employers doing it right! You got this Hina! 💪',
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 504,
        author: 'Farhan Ahmed',
        authorId: 'farhan_ahmed',
        content: 'Inspirational! Stories like these motivate us all.',
        createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      }
    ],
    badge: 'Active Member',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  }
];

export default function CommunityForum() {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId] = useState('user123');
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent'>('all');
  const toast = useToast();

  // Fetch posts from backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/community/posts`);
      
      if (response.data.posts && response.data.posts.length > 0) {
        setPosts(response.data.posts);
      } else {
        // If no posts from backend, use dummy posts
        setPosts(DUMMY_POSTS);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // On error, fallback to dummy posts
      setPosts(DUMMY_POSTS);
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Image must be less than 5MB',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/community/posts/${postId}/like`, {
        userId: currentUserId
      });

      setPosts(posts.map(post =>
        (post._id || post.id) === postId
          ? {
            ...post,
            likes: response.data.likes,
            likedBy: response.data.likedBy,
            isLiked: response.data.likedBy?.includes(currentUserId)
          }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      // Fallback to local state update if backend fails
      setPosts(posts.map(post => {
        if ((post._id || post.id?.toString()) === postId) {
          const isCurrentlyLiked = post.likedBy?.includes(currentUserId);
          return {
            ...post,
            likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isCurrentlyLiked 
              ? post.likedBy?.filter(id => id !== currentUserId) 
              : [...(post.likedBy || []), currentUserId],
            isLiked: !isCurrentlyLiked
          };
        }
        return post;
      }));
    }
  };

  const handleComment = async (postId: string) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) {
      toast({
        title: 'Comment is empty',
        description: 'Please write something',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/community/posts/${postId}/comment`, {
        userId: currentUserId,
        author: 'You',
        content: commentText
      });

      setPosts(posts.map(post =>
        (post._id || post.id) === postId
          ? { ...post, comments: response.data.comments }
          : post
      ));

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));

      toast({
        title: 'Comment added',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      // Fallback to local state update if backend fails
      const newComment: Comment = {
        id: Date.now(),
        author: 'You',
        authorId: currentUserId,
        content: commentText,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      setPosts(posts.map(post =>
        (post._id || post.id?.toString()) === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));

      toast({
        title: 'Comment added',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast({
        title: 'Post content required',
        description: 'Please write something',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/community/posts`, {
        userId: currentUserId,
        author: 'You',
        content: newPostContent,
        image: selectedImage,
        badge: 'Active Member'
      });

      setPosts([response.data.post, ...posts]);
      setNewPostContent('');
      setSelectedImage(null);

      toast({
        title: 'Post created!',
        description: 'Your post has been shared',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      // Fallback to local state update if backend fails
      const newPost: Post = {
        id: Date.now(),
        author: 'You',
        authorId: currentUserId,
        content: newPostContent,
        image: selectedImage || undefined,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
        badge: 'Active Member',
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setSelectedImage(null);

      toast({
        title: 'Post created!',
        description: 'Your post has been shared',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/community/posts/${postId}`, {
        data: { userId: currentUserId }
      });

      setPosts(posts.filter(post => (post._id || post.id) !== postId));

      toast({
        title: 'Post deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      // Fallback to local state update if backend fails
      setPosts(posts.filter(post => (post._id || post.id?.toString()) !== postId));

      toast({
        title: 'Post deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getFilteredPosts = () => {
    let filtered = [...posts];

    if (filter === 'trending') {
      filtered.sort((a, b) => (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2));
    } else if (filter === 'recent') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'Just now';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [showComments, setShowComments] = useState(false);
    const postId = (post._id || post.id)?.toString() || '';

    return (
      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        mb={4}
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        transition="all 0.3s"
        _hover={{
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        }}
      >
        <HStack align="start" spacing={4} mb={4}>
          <Avatar
            name={post.author}
            size="md"
            bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
            color="white"
          >
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>

          <VStack align="start" flex={1} spacing={1}>
            <HStack spacing={2} flexWrap="wrap">
              <Text fontWeight="700" fontSize="md" color="gray.900">
                {post.author}
              </Text>
              {post.badge && (
                <Badge
                  colorScheme="teal"
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontWeight="600"
                >
                  {post.badge}
                </Badge>
              )}
            </HStack>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              {formatTimestamp(post.createdAt || post.timestamp)}
            </Text>
          </VStack>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
              color="gray.400"
              _hover={{ color: 'gray.600', bg: 'gray.50' }}
            />
            <MenuList fontSize="sm">
              <MenuItem icon={<FiEdit2 />}>Edit Post</MenuItem>
              <MenuItem
                icon={<FiTrash2 />}
                color="red.500"
                onClick={() => handleDeletePost(postId)}
              >
                Delete Post
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Text
          fontSize="15px"
          color="gray.700"
          mb={4}
          lineHeight="1.7"
          whiteSpace="pre-wrap"
        >
          {post.content}
        </Text>

        {post.image && (
          <Box mb={4} borderRadius="lg" overflow="hidden">
            <Image
              src={post.image}
              alt="Post image"
              w="full"
              maxH="500px"
              objectFit="cover"
              transition="transform 0.3s"
              _hover={{ transform: 'scale(1.02)' }}
            />
          </Box>
        )}

        <Divider mb={4} />

        <HStack spacing={4} mb={3}>
          <Button
            leftIcon={<FiHeart fill={post.isLiked || post.likedBy?.includes(currentUserId) ? 'currentColor' : 'none'} />}
            variant="ghost"
            size="sm"
            color={post.isLiked || post.likedBy?.includes(currentUserId) ? 'red.500' : 'gray.600'}
            onClick={() => handleLike(postId)}
            fontWeight="600"
            _hover={{
              bg: 'red.50',
              color: 'red.600',
            }}
          >
            {post.likes} Likes
          </Button>

          <Button
            leftIcon={<FiMessageCircle />}
            variant="ghost"
            size="sm"
            color="gray.600"
            fontWeight="600"
            onClick={() => setShowComments(!showComments)}
            _hover={{
              bg: 'blue.50',
              color: 'blue.600',
            }}
          >
            {post.comments.length} Comments
          </Button>

          <Tooltip label="Share post" fontSize="xs">
            <IconButton
              aria-label="Share post"
              icon={<FiShare2 />}
              variant="ghost"
              size="sm"
              color="gray.600"
              _hover={{
                bg: 'green.50',
                color: 'green.600',
              }}
            />
          </Tooltip>
        </HStack>

        {showComments && (
          <VStack align="start" w="full" spacing={3} mt={4}>
            <Divider />

            {post.comments.length === 0 ? (
              <Text fontSize="sm" color="gray.500" py={4} textAlign="center" w="full">
                No comments yet. Be the first to comment!
              </Text>
            ) : (
              post.comments.map((comment) => (
                <HStack key={comment._id || comment.id} align="start" w="full" spacing={3}>
                  <Avatar
                    name={comment.author}
                    size="sm"
                    bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
                  />
                  <Box flex={1} bg="gray.50" p={3} borderRadius="lg">
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="600" fontSize="sm" color="gray.900">
                        {comment.author}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatTimestamp(comment.createdAt || comment.timestamp)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      {comment.content}
                    </Text>
                  </Box>
                </HStack>
              ))
            )}

            <HStack w="full" spacing={2} pt={2}>
              <Avatar
                name="You"
                size="sm"
                bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
              />
              <Input
                placeholder="Write a comment..."
                size="sm"
                value={commentInputs[postId] || ''}
                onChange={(e) => {
                  setCommentInputs(prev => ({
                    ...prev,
                    [postId]: e.target.value
                  }));
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment(postId);
                  }
                }}
                borderRadius="full"
                bg="gray.50"
                border="none"
                focusBorderColor="#2CA58D"
                _hover={{ bg: 'gray.100' }}
              />
              <IconButton
                aria-label="Send comment"
                icon={<FiSend />}
                colorScheme="teal"
                bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
                size="sm"
                borderRadius="full"
                onClick={() => handleComment(postId)}
                isDisabled={!commentInputs[postId]?.trim()}
                _hover={{
                  bg: 'linear-gradient(135deg, #1e8a73 0%, #166b5c 100%)',
                }}
              />
            </HStack>
          </VStack>
        )}
      </Box>
    );
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <SideNav activeNav="Community Forum" />
      <Box>
        <TopNav />
        <Box mt={"20px"} ml={"110px"}>
          <Flex px={6} py={6} gap={8} maxW="1900px" mx="auto">
            {/* Left Side - Posts Feed */}
            <VStack flex={1} spacing={0} align="stretch" maxW="900px">
              <Box mb={6}>
                <Text fontSize="3xl" fontWeight="800" color="gray.900" mb={2}>
                  Community Forum
                </Text>
                <Text fontSize="md" color="gray.600">
                  Connect, share, and grow with the AbleTech community
                </Text>
              </Box>

              {/* Filter Tabs */}
              <HStack spacing={2} mb={6}>
                <Tag
                  size="lg"
                  cursor="pointer"
                  bg={filter === 'all' ? '#2CA58D' : 'white'}
                  color={filter === 'all' ? 'white' : 'gray.600'}
                  onClick={() => setFilter('all')}
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="1px solid"
                  borderColor={filter === 'all' ? '#2CA58D' : 'gray.200'}
                  _hover={{ bg: filter === 'all' ? '#258b75' : 'gray.50' }}
                >
                  All Posts
                </Tag>
                <Tag
                  size="lg"
                  cursor="pointer"
                  bg={filter === 'trending' ? '#2CA58D' : 'white'}
                  color={filter === 'trending' ? 'white' : 'gray.600'}
                  onClick={() => setFilter('trending')}
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="1px solid"
                  borderColor={filter === 'trending' ? '#2CA58D' : 'gray.200'}
                  _hover={{ bg: filter === 'trending' ? '#258b75' : 'gray.50' }}
                >
                  <FiTrendingUp style={{ marginRight: '6px' }} />
                  Trending
                </Tag>
                <Tag
                  size="lg"
                  cursor="pointer"
                  bg={filter === 'recent' ? '#2CA58D' : 'white'}
                  color={filter === 'recent' ? 'white' : 'gray.600'}
                  onClick={() => setFilter('recent')}
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="1px solid"
                  borderColor={filter === 'recent' ? '#2CA58D' : 'gray.200'}
                  _hover={{ bg: filter === 'recent' ? '#258b75' : 'gray.50' }}
                >
                  Recent
                </Tag>
              </HStack>

              {loading ? (
                <Flex justify="center" align="center" py={20}>
                  <Spinner size="xl" color="#2CA58D" thickness="4px" />
                </Flex>
              ) : getFilteredPosts().length === 0 ? (
                <Box textAlign="center" py={20}>
                  <Text fontSize="lg" color="gray.500" mb={2}>
                    No posts yet. Be the first to share!
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Create a post above to start the conversation
                  </Text>
                </Box>
              ) : (
                getFilteredPosts().map((post) => (
                  <PostCard key={post._id || post.id} post={post} />
                ))
              )}
            </VStack>

            {/* Right Side - Create Post & Stats */}
            <Box w="420px" ml={4}>
              <Box position="sticky" top="100px">
                {/* Create Post Box */}
                <Box
                  bg="white"
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  mb={4}
                >
                  <HStack mb={4}>
                    <FiEdit2 color="#2CA58D" size={20} />
                    <Text fontSize="lg" fontWeight="700" color="gray.900">
                      Create Post
                    </Text>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    <Textarea
                      placeholder="Share your thoughts, achievements, or questions... 💭"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      minH="140px"
                      resize="vertical"
                      fontSize="sm"
                      borderRadius="lg"
                      focusBorderColor="#2CA58D"
                      bg="gray.50"
                      border="none"
                      _hover={{ bg: 'gray.100' }}
                    />

                    {selectedImage && (
                      <Box position="relative" borderRadius="lg" overflow="hidden">
                        <Image
                          src={selectedImage}
                          alt="Upload preview"
                          maxH="200px"
                          w="full"
                          objectFit="cover"
                        />
                        <IconButton
                          aria-label="Remove image"
                          icon={<FiX />}
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme="red"
                          size="sm"
                          borderRadius="full"
                          onClick={() => setSelectedImage(null)}
                        />
                      </Box>
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      display="none"
                      id="image-upload"
                    />

                    <HStack spacing={2}>
                      <label htmlFor="image-upload" style={{ flex: 1 }}>
                        <Button
                          as="span"
                          leftIcon={<FiImage />}
                          variant="outline"
                          colorScheme="teal"
                          w="full"
                          cursor="pointer"
                          size="md"
                          borderRadius="lg"
                          fontWeight="600"
                        >
                          Add Photo
                        </Button>
                      </label>

                      <Button
                        colorScheme="teal"
                        bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
                        onClick={handleCreatePost}
                        isDisabled={!newPostContent.trim()}
                        flex={1}
                        size="md"
                        borderRadius="lg"
                        fontWeight="600"
                        _hover={{
                          bg: 'linear-gradient(135deg, #1e8a73 0%, #166b5c 100%)',
                        }}
                      >
                        Post
                      </Button>
                    </HStack>
                  </VStack>
                </Box>

                {/* Community Stats */}
                <Box
                  bg="white"
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  mb={4}
                >
                  <HStack mb={4}>
                    <FiUsers color="#2CA58D" size={20} />
                    <Text fontSize="lg" fontWeight="700" color="gray.900">
                      Community Stats
                    </Text>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" p={3} bg="teal.50" borderRadius="lg">
                      <Text fontSize="sm" color="gray.700" fontWeight="600">Total Posts</Text>
                      <Text fontSize="xl" fontWeight="800" color="#2CA58D">
                        {posts.length}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" p={3} bg="red.50" borderRadius="lg">
                      <Text fontSize="sm" color="gray.700" fontWeight="600">Total Likes</Text>
                      <Text fontSize="xl" fontWeight="800" color="red.500">
                        {posts.reduce((sum, post) => sum + post.likes, 0)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" p={3} bg="blue.50" borderRadius="lg">
                      <Text fontSize="sm" color="gray.700" fontWeight="600">Total Comments</Text>
                      <Text fontSize="xl" fontWeight="800" color="blue.500">
                        {posts.reduce((sum, post) => sum + post.comments.length, 0)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Top Contributors */}
                <Box
                  bg="white"
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <HStack mb={4}>
                    <FiAward color="#2CA58D" size={20} />
                    <Text fontSize="lg" fontWeight="700" color="gray.900">
                      Top Contributors
                    </Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    {posts.length === 0 ? (
                      <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
                        No contributors yet
                      </Text>
                    ) : (
                      Object.entries(
                        posts.reduce((acc, post) => {
                          const author = post.author;
                          acc[author] = (acc[author] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([name, count], idx) => (
                          <HStack key={name} p={2}>
                            <Text fontSize="sm" fontWeight="700" color="gray.500" w="20px">
                              #{idx + 1}
                            </Text>
                            <Avatar
                              name={name}
                              size="sm"
                              bg="linear-gradient(135deg, #2CA58D 0%, #1e8a73 100%)"
                            />
                            <Text fontSize="sm" fontWeight="600" color="gray.700" flex={1}>
                              {name}
                            </Text>
                            <Badge colorScheme="teal" fontSize="xs">
                              {count} {count === 1 ? 'post' : 'posts'}
                            </Badge>
                          </HStack>
                        ))
                    )}
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}