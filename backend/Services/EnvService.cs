using StudyVerseBackend.Interfaces;

namespace StudyVerseBackend.Services;

public class EnvService : IEnvService
{
    public string? Get(string key)
    {
        return DotNetEnv.Env.GetString(key);
    }
}