const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email when a user is followed
 * @param {Object} params
 * @param {string} params.followerName - Name of person who followed
 * @param {string} params.followerEmail - Email of person who followed
 * @param {string} params.userId - ID of user being followed
 * @param {string} params.userEmail - Email of user being followed
 * @returns {Promise}
 */
const sendFollowNotification = async ({ followerName, followerEmail, userId, userEmail }) => {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@zarrin-blogs.com',
      to: userEmail,
      subject: `${followerName} started following you! 👋`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">New Follower!</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              <strong>${followerName}</strong> just started following you on Zarrin Blogs! 🎉
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Check out their profile and see what they've been reading.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/${userId}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Profile</a>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              You received this email because someone followed you on Zarrin Blogs.
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Error sending follow notification:', error);
    throw error;
  }
};

/**
 * Send email when someone comments on your blog
 * @param {Object} params
 * @param {string} params.commenterName - Name of person who commented
 * @param {string} params.blogTitle - Title of the blog
 * @param {string} params.blogId - ID of the blog
 * @param {string} params.userEmail - Email of blog author
 * @param {string} params.commentPreview - First 100 chars of comment
 * @returns {Promise}
 */
const sendCommentNotification = async ({ commenterName, blogTitle, blogId, userEmail, commentPreview }) => {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@zarrin-blogs.com',
      to: userEmail,
      subject: `${commenterName} commented on "${blogTitle}" 💬`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">New Comment!</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              <strong>${commenterName}</strong> commented on your blog <strong>"${blogTitle}"</strong> 💬
            </p>
            <div style="background: white; padding: 15px; border-left: 4px solid #f5576c; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #666; font-style: italic; font-size: 14px;">
                "${commentPreview}..."
              </p>
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Read the full comment and reply below.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${blogId}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Comment</a>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              You received this email because someone commented on your blog.
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Error sending comment notification:', error);
    throw error;
  }
};

/**
 * Send email when someone likes your blog
 * @param {Object} params
 * @param {string} params.likerName - Name of person who liked
 * @param {string} params.blogTitle - Title of the blog
 * @param {string} params.blogId - ID of the blog
 * @param {string} params.userEmail - Email of blog author
 * @param {number} params.totalLikes - Total number of likes on blog
 * @returns {Promise}
 */
const sendLikeNotification = async ({ likerName, blogTitle, blogId, userEmail, totalLikes }) => {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@zarrin-blogs.com',
      to: userEmail,
      subject: `${likerName} liked your blog "${blogTitle}" ❤️`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Blog Liked! ❤️</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              <strong>${likerName}</strong> liked your blog <strong>"${blogTitle}"</strong> ❤️
            </p>
            <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; color: white; font-size: 24px; font-weight: bold;">
                ❤️ ${totalLikes} ${totalLikes === 1 ? 'Like' : 'Likes'}
              </p>
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Great job! Your blog is getting engagement. Keep writing amazing content!
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${blogId}" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Blog</a>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              You received this email because someone liked your blog.
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Error sending like notification:', error);
    throw error;
  }
};

module.exports = {
  sendFollowNotification,
  sendCommentNotification,
  sendLikeNotification,
};
