namespace LisMusic.Models
{
    public class MusicShare
    {
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Info { get; set; }

        public bool IsNullOrEmpty()
        {
            return IsNullOrEmpty(this);
        }

        public static bool IsNullOrEmpty(MusicShare musicShare)
        {
            if(musicShare == null)
            {
                return true;
            }
            if (string.IsNullOrEmpty(musicShare.Name) && string.IsNullOrEmpty(musicShare.Artist) && string.IsNullOrEmpty(musicShare.Info))
            {
                return true;
            }

            return false;
        }
    }
}
