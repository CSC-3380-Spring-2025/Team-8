using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models.GalaxyBoost;

namespace StudyVerseBackend.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class GalaxyBoostController : ControllerBase
    {
        private readonly GalaxyBoostService _galaxyBoostService;

        public GalaxyBoostController(GalaxyBoostService gravityBoostService)
        {
            _galaxyBoostService = galaxyBoostService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoost([FromBody] GalaxyBoostPostDto galaxyBoostPostDto)
        {
            var createdBoost = await _galaxyBoostService.CreateBoost(boost);
            return CreatedAtAction(nameof(GetBoostById), new { id = createdBoost.BoostId }, createdBoost);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBoosts()
        {
            var boosts = await _galaxyBoostService.GetAllBoosts();
            return Ok(boosts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoostById(int id)
        {
            var boost = await _galaxyBoostService.GetBoostById(id);
            if (boost == null) return NotFound();
            return Ok(boost);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBoost(int id, [FromBody] GalaxyBoostPostDto galaxyBoostPostDto)
        {
            var updatedBoost = await _galaxyBoostService.UpdateBoost(id, boost);
            if (updatedBoost == null) return NotFound();
            return Ok(updatedBoost);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoost(int id)
        {
            var deleted = await _galaxyBoostService.DeleteBoost(id);
            if (!deleted) return NotFound();
            return Ok(new { message = "Galaxy Boost deleted successfully" });
        }
    }
}
